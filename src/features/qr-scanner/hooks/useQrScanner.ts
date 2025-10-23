// src/hooks/useQrScanner.ts
import { useEffect, useRef, useState, useCallback } from "react";
import QrScanner from "qr-scanner";

export type QrResultHandler = (text: string) => void;
type Facing = "user" | "environment";

const FRONT_REGEX = /front|user|depan|selfie/i;
const BACK_REGEX = /back|rear|environment|belakang/i;

export function useQrScanner(onResult: QrResultHandler) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [currentCamId, setCurrentCamId] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState<Facing>("environment");

  const stop = useCallback(async () => {
    try {
      await scannerRef.current?.stop();
    } catch {}
    setActive(false);
  }, []);

  const listAndSetCameras = useCallback(async () => {
    const list = await QrScanner.listCameras(true);
    setCameras(list);
    return list;
  }, []);

  const start = useCallback(
    async (deviceId?: string, prefer?: Facing) => {
      setError(null);
      if (!videoRef.current) return;

      // dispose lama
      await stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;

      const prefFacing: Facing = prefer ?? "environment";
      const scanner = new QrScanner(
        videoRef.current,
        (res) => {
          const text = typeof res === "string" ? res : res?.data;
          if (text) {
            onResult(text);
            stop();
          }
        },
        {
          onDecodeError: () => {},
          maxScansPerSecond: 8,
          preferredCamera: deviceId ?? prefFacing, // QrScanner mendukung 'user' / 'environment'
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;
      try {
        await scanner.start();
        setActive(true);

        // daftar kamera
        const list = await listAndSetCameras();

        // tentukan camId final
        let camId: string | null = deviceId ?? null;
        if (!camId) {
          const picked = pickCameraByFacing(list, prefFacing);
          camId = picked?.id ?? null;
        }
        if (camId) setCurrentCamId(camId);

        // set facing berdasarkan label/id
        const label = list.find((c) => c.id === camId)?.label ?? "";
        const isFront = FRONT_REGEX.test(label);
        setFacing(isFront ? "user" : "environment");

        // torch
        const has = await scanner.hasFlash();
        setHasTorch(has);
        setTorchOn(false);
      } catch (e: any) {
        setError(e?.message || "Tidak bisa mengakses kamera");
        await stop();
      }
    },
    [listAndSetCameras, onResult, stop]
  );

  const switchCamera = useCallback(
    async (deviceId: string) => {
      if (!scannerRef.current) return;
      try {
        await scannerRef.current.setCamera(deviceId);
        setCurrentCamId(deviceId);
        const list = cameras.length
          ? cameras
          : await QrScanner.listCameras(true);
        const label = list.find((c) => c.id === deviceId)?.label ?? "";
        setFacing(FRONT_REGEX.test(label) ? "user" : "environment");

        const has = await scannerRef.current.hasFlash();
        setHasTorch(has);
        setTorchOn(false);
      } catch (e: any) {
        setError(e?.message || "Gagal mengganti kamera");
      }
    },
    [cameras]
  );

  function pickCameraByFacing(list: QrScanner.Camera[], want: Facing) {
    if (!list?.length) return null;
    const byRegex = want === "user" ? FRONT_REGEX : BACK_REGEX;
    // 1) cari yang label match
    const exact = list.find((c) => byRegex.test(c.label || ""));
    if (exact) return exact;
    // 2) fallback: id kadang mengandung petunjuk
    const byId = list.find((c) => byRegex.test(c.id || ""));
    if (byId) return byId;
    // 3) fallback terakhir: pertama/terakhir
    return want === "user" ? list[0] : list[list.length - 1];
  }

  const switchFacing = useCallback(async () => {
    const want: Facing = facing === "user" ? "environment" : "user";
    const list = cameras.length ? cameras : await QrScanner.listCameras(true);
    const picked = pickCameraByFacing(list, want);
    if (!picked) return;

    if (scannerRef.current && active) {
      await scannerRef.current.setCamera(picked.id);
      setCurrentCamId(picked.id);
      setFacing(want);
      const has = await scannerRef.current.hasFlash();
      setHasTorch(has);
      setTorchOn(false);
    } else {
      // kalau belum aktif, start dengan facing yang diminta
      await start(picked.id, want);
    }
  }, [active, cameras, facing, start]);

  const toggleTorch = useCallback(async () => {
    if (!scannerRef.current) return;
    try {
      if (torchOn) {
        await scannerRef.current.turnFlashOff();
        setTorchOn(false);
      } else {
        await scannerRef.current.turnFlashOn();
        setTorchOn(true);
      }
    } catch (e: any) {
      setError(e?.message || "Gagal mengatur flash");
    }
  }, [torchOn]);

  useEffect(() => {
    return () => {
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
  }, []);

  // === Mirror preview bila front camera ===
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.transform =
        facing === "user" ? "scaleX(-1)" : "none";
    }
  }, [facing]);

  return {
    videoRef,
    cameras,
    currentCamId,
    start,
    stop,
    active,
    hasTorch,
    torchOn,
    toggleTorch,
    switchCamera,
    switchFacing, // <<— expose
    facing, // <<— expose
    error,
  };
}

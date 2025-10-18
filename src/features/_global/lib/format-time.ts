interface IFormatDate {
  year: "numeric" | "2-digit";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day: "numeric" | "2-digit";
  timeZone?: string;
}

interface IFormatTime {
  hour: "numeric" | "2-digit";
  minute: "numeric" | "2-digit";
  timeZone: string;
}

export function formatDate(isoDate: Date) {
  const date = new Date(isoDate);

  const optionsDate: IFormatDate = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone: "UTC",
  };

  const optionsTime: IFormatTime = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };
  const formattedDate = date.toLocaleDateString("id-ID", optionsDate);
  const formattedTime = date.toLocaleString("id-ID", optionsTime);

  console.log(formattedDate, "tes");
  return `${formattedDate}, ${formattedTime}`;
}

export function formatTime(date: Date, withTime: boolean = true): string {
  const minutes = new Date(date).getUTCMinutes().toString().padStart(2, "0");
  const hours = new Date(date).getHours().toString().padStart(2, "0");
  const month = new Date(date).toLocaleString("id-ID", { month: "long" });
  const year = new Date(date).getFullYear();
  const getDate = new Date(date).getDate();

  return `${getDate} ${month} ${year}${
    withTime ? `, ${hours}:${minutes}` : ""
  }`;
}

export function formatHourMinute(date: Date): string {
  const minutes = new Date(date).getUTCMinutes().toString().padStart(2, "0");
  const hours = new Date(date).getHours().toString().padStart(2, "0");

  return `${hours}:${minutes}`
}

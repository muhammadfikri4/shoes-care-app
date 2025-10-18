import { useMutation, useQuery } from '@tanstack/react-query';
import { racksService } from '@core/services/pos';
import { RackModel } from '@core/model/rack';

export const useRacksList = () => useQuery({ queryKey: ['racks'], queryFn: () => racksService.list() });

export const useRackCreate = () => useMutation({ mutationKey: ['rack-create'], mutationFn: (body: { code: string; name?: string; location?: string }) => racksService.create(body) });

export const useRackUpdate = () => useMutation({ mutationKey: ['rack-update'], mutationFn: ({ id, ...body }: { id: string; code?: string; name?: string; location?: string }) => racksService.update(id)(body) });

export const useRackRemove = () => useMutation({ mutationKey: ['rack-remove'], mutationFn: (id: string) => racksService.remove(id)() });


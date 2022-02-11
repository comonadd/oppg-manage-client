import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { WS_API_ROOT, API_ROOT } from "./constants";
import { FetchStatus } from "./util";
import { keyByIntoMap } from "./util";

const enum Status {
  InProgress = 0,
  Done = 1,
  Failed = 2,
}

const statusStringMapping: Record<Status, string> = {
  [Status.InProgress]: "In progress",
  [Status.Done]: "Done",
  [Status.Failed]: "Failed",
};

export const statusToString = (status: Status): string => {
  return statusStringMapping[status];
};

type OpId = number;

export interface Operation {
  id: OpId;
  name: string;
  status: Status;
}

interface CurrentOperationsState {
  data: Operation[];
  loading: boolean;
  createNewOperation: (op: Partial<Operation>) => Promise<Operation>;
}

type OpById = Map<OpId, Operation>;
export const useCurrentOperations = (): CurrentOperationsState => {
  const socket = useRef<Socket | null>(null);
  const [loadStatus, setLoadStatus] = useState(FetchStatus.Initial);
  const [data, setData] = useState<OpById>(new Map());

  const loadInitial = async () => {
    setLoadStatus(FetchStatus.InProgress);
    const resp = await axios.get<Operation[]>(`${API_ROOT}/operations`);
    setData(keyByIntoMap(resp.data, "id"));
    setLoadStatus(FetchStatus.Success);
  };

  useEffect(() => {
    socket.current = io(WS_API_ROOT, { transports: ["websocket"] });
    socket.current!.on("updateOperation", (payload: Operation) => {
      setData((currData) => {
        const updated = new Map(currData);
        const oldData = currData.get(payload.id) ?? {};
        updated.set(payload.id, { ...oldData, ...payload });
        return updated;
      });
    });
    loadInitial();
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const createNewOperation = async (op: Partial<Operation>) => {
    const resp = await axios.post<Operation>(`${API_ROOT}/operations`, op);
    const updated = new Map(data);
    updated.set(resp.data.id, resp.data);
    setData(updated);
    return resp.data;
  };

  const loading = loadStatus === FetchStatus.InProgress;
  const arrData = useMemo(() => Array.from(data.values()), [data]);

  return {
    data: arrData,
    loading,
    createNewOperation,
  };
};

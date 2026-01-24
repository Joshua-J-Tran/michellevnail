import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { type IWorker, type ISalon } from "@/interfaces";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { backendUrl } from "@/constants";

axios.defaults.withCredentials = true;

export default function OwnerWorkersPage() {
  const [workers, setWorkers] = useState<IWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const getWorkers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/workers/get-workers-by-owner`);
      if (!res.data.success) throw new Error(res.data.message);
      setWorkers(res.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch workers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workerId: string) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${backendUrl}/workers/delete-worker-by-id/${workerId}`);
      if (!res.data.success) throw new Error(res.data.message);
      toast.success("Worker deleted successfully");
      setWorkers((prev) => prev.filter((w) => w._id !== workerId));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete worker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkers();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageTitle title="My Workers" />
        <Button
          className="bg-amber-100 hover:bg-amber-600 transition-colors font-bold text-secondary"
          onClick={() => navigate("/owner/workers/add")}
        >
          Add Worker
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : workers.length === 0 ? (
        <p>No workers found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50 font-bold">
              <TableCell>Worker Name</TableCell>
              <TableCell>Assigned Salon</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((worker) => (
              <TableRow key={worker._id}>
                <TableCell>{worker.name}</TableCell>
                <TableCell>
                  {typeof worker.salon === "string"
                    ? "Unknown"
                    : (worker.salon as ISalon)?.name || "Unknown"}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="icon"
                    onClick={() =>
                      navigate(`/owner/workers/edit/${worker._id}`)
                    }
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(worker._id!)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

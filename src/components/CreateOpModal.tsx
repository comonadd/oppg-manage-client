import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Operation } from "operation";
import { ModalController } from "hooks";

const CreateOpModal = (props: {
  onCreate: (op: Partial<Operation>) => Promise<Operation>;
  modal: ModalController;
}) => {
  const [operationName, setOperationName] = useState<string>("");
  const canCreate = operationName.trim().length !== 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await props.onCreate({ name: operationName });
    setOperationName("");
  };

  return (
    <Dialog open={props.modal.isShown} onClose={props.modal.close}>
      <form onSubmit={onSubmit}>
        <DialogTitle>Create a new operation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name of operation"
            fullWidth
            variant="standard"
            value={operationName}
            onChange={(e) => setOperationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={props.modal.close}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={!canCreate}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateOpModal;

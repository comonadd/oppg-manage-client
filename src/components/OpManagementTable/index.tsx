import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { Box, Button, TableFooter, TablePagination } from "@mui/material";
import { Operation, statusToString, useCurrentOperations } from "operation";
import { useModal } from "hooks";
import CreateOpModal from "components/CreateOpModal";

const rowsPerPage = 5;

const OpManagementTable = () => {
  const { data, loading, createNewOperation } = useCurrentOperations();
  const createModal = useModal();

  // pagination
  const [page, setPage] = useState(0);
  const handleChangePage = (_: any, page: number) => setPage(page);
  const startRow = page * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const rows = data.slice(startRow, endRow);
  const goToLastPage = () => {
    const p = Math.floor(data.length / rowsPerPage);
    setPage(p);
  };
  const emptyRows = rows.length === 0 ? 0 : rowsPerPage - rows.length;

  const onCreate = async (op: Partial<Operation>) => {
    const res = await createNewOperation(op);
    createModal.close();
    goToLastPage();
    return res;
  };

  return (
    <Box
      sx={{
        width: "fit-content",
        padding: 2,
        minWidth: {
          xs: "100%",
          md: 700,
        },
      }}
    >
      <header className="df fdrr" style={{ marginBottom: 16 }}>
        <Button variant="outlined" color="primary" onClick={createModal.open}>
          Create
        </Button>
      </header>
      <CreateOpModal onCreate={onCreate} modal={createModal} />
      <TableContainer component={Paper}>
        <Table
          sx={{
            overflowX: "auto",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Operation</TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell component="td" scope="row" colSpan={2}>
                  <div style={{ height: 400 }} className="df fc w-100">
                    No operations
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">
                    {statusToString(row.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[rowsPerPage]}
                labelRowsPerPage={<span>Rows:</span>}
                labelDisplayedRows={({ page }) => {
                  return `Page: ${page + 1}`;
                }}
                backIconButtonProps={{
                  color: "secondary",
                }}
                nextIconButtonProps={{ color: "secondary" }}
                SelectProps={{
                  inputProps: {
                    "aria-label": "page number",
                  },
                }}
                showFirstButton={true}
                showLastButton={true}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OpManagementTable;

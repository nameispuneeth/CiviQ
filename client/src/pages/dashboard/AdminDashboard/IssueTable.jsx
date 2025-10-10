import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

export default function IssuesTable({ issues }) {
  const columns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "status", label: "Status", minWidth: 120 },
    { id: "priority", label: "Priority", minWidth: 120 },
    { id: "category", label: "Category", minWidth: 150 },
    { id: "department", label: "Department", minWidth: 150 },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="issues table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {issues
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((issue) => (
                <TableRow hover key={issue.id}>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>{issue.status}</TableCell>
                  <TableCell>{issue.priority}</TableCell>
                  <TableCell>{issue.category}</TableCell>
                  <TableCell>{issue.department || "None"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={issues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

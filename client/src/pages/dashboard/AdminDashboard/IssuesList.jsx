// import React, { useContext, useState } from "react";
// import { ThemeContext } from "../../../Context/ThemeContext";
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   TextField,
// } from "@mui/material";

// export default function IssuesList({ issues, setIssues, filters, setFilters, setSelectedIssue }) {
//   const { isDark } = useContext(ThemeContext);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const filteredIssues = issues.filter(
//     (i) =>
//       (!filters.search || i.title.toLowerCase().includes(filters.search.toLowerCase())) &&
//       (statusFilter === "all" || i.status === statusFilter)
//   );

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const updateStatus = (issueId, newStatus) => {
//     setIssues((prev) =>
//       prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
//     );
//   };

//   const paperBg = isDark ? "#1E1E1E" : "#FFF";
//   const textColor = isDark ? "#FFF" : "#000";

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden", p: 2, bgcolor: paperBg, color: textColor }}>
//       {/* Search & Status Filter */}
//       <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
//         <TextField
//           label="Search"
//           size="small"
//           value={filters.search}
//           onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//           sx={{ bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
//         />
//         <FormControl size="small" sx={{ minWidth: 200 }}>
//           <InputLabel>Status Filter</InputLabel>
//           <Select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             sx={{ bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
//           >
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="pending">Pending</MenuItem>
//             <MenuItem value="in_progress">In Progress</MenuItem>
//             <MenuItem value="completed">Completed</MenuItem>
//           </Select>
//         </FormControl>
//       </div>

//       {/* Issues Table */}
//       <TableContainer sx={{ maxHeight: 500 }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               {["Title", "Status", "Priority", "Category", "Department", "Action"].map((head) => (
//                 <TableCell key={head} sx={{ color: textColor }}>{head}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredIssues
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((issue) => (
//                 <TableRow hover key={issue.id}>
//                   {/* Title - click to open modal */}
//                   <TableCell
//                     sx={{ cursor: "pointer", color: isDark ? "#90caf9" : "#1976d2" }}
//                     onClick={() => setSelectedIssue(issue)}
//                   >
//                     {issue.title}
//                   </TableCell>

//                   {/* Status select */}
//                   <TableCell>
//                     <Select
//                       value={issue.status}
//                       onChange={(e) => updateStatus(issue.id, e.target.value)}
//                       size="small"
//                       sx={{ minWidth: 120, bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
//                     >
//                       <MenuItem value="pending">Pending</MenuItem>
//                       <MenuItem value="in_progress">In Progress</MenuItem>
//                       <MenuItem value="completed">Completed</MenuItem>
//                     </Select>
//                   </TableCell>

//                   <TableCell>{issue.priority}</TableCell>
//                   <TableCell>{issue.category}</TableCell>

//                   {/* Department select */}
//                   <TableCell>
//   <Select
//     value={issue.department || ""} // always controlled
//     onChange={(e) =>
//       setIssues(prev =>
//         prev.map(i =>
//           i.id === issue.id
//             ? { ...i, department: e.target.value } // new object
//             : i
//         )
//       )
//     }
//     size="small"
//     sx={{ minWidth: 140, bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
//     disabled={issue.status !== "pending"} // only editable when pending
//     displayEmpty
//   >
//     <MenuItem value="" disabled>
//       Select Department
//     </MenuItem>
//     <MenuItem value="IT">IT</MenuItem>
//     <MenuItem value="HR">HR</MenuItem>
//     <MenuItem value="Maintenance">Maintenance</MenuItem>
//     <MenuItem value="Admin">Admin</MenuItem>
//   </Select>
// </TableCell>


//                   {/* Assign button */}
//                   <TableCell>
//                     {issue.status === "pending" && (
//                       <button
//                         onClick={() => alert(`Issue "${issue.title}" assigned to ${issue.department || "No Dept"}`)}
//                         disabled={!issue.department}
//                         style={{
//                           padding: "4px 8px",
//                           backgroundColor: "#1976d2",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "4px",
//                           cursor: issue.department ? "pointer" : "not-allowed",
//                         }}
//                       >
//                         Assign
//                       </button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25, 50]}
//         component="div"
//         count={filteredIssues.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }
import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from "@mui/material";

export default function IssuesList({ issues, setIssues, filters, setFilters, setSelectedIssue }) {
  const { isDark } = useContext(ThemeContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Local state for table editing
  const [localIssues, setLocalIssues] = useState([]);

  useEffect(() => {
    setLocalIssues([...issues]); // Initialize local state when issues prop changes
  }, [issues]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const updateStatus = (issueId, newStatus) => {
    setLocalIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: newStatus, department: newStatus === "pending" ? i.department : "" } : i))
    );
  };

  const updateDepartment = (issueId, newDept) => {
    setLocalIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, department: newDept } : i))
    );
  };

  const handleSave = () => {
    setIssues([...localIssues]); // Update parent issues
    alert("Changes saved!");
  };

  const filteredIssues = localIssues.filter(
    (i) =>
      (!filters.search || i.title.toLowerCase().includes(filters.search.toLowerCase())) &&
      (statusFilter === "all" || i.status === statusFilter)
  );

  const paperBg = isDark ? "#1E1E1E" : "#FFF";
  const textColor = isDark ? "#FFF" : "#000";
  const pendingBg = isDark ? "#2A2A3A" : "#FFF3E0"; // Highlight for pending

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2, bgcolor: paperBg, color: textColor }}>
      {/* Search & Status Filter */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <TextField
          label="Search"
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          sx={{ bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Issues Table */}
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {["Title", "Status", "Priority", "Category", "Department", "Action"].map((head) => (
                <TableCell key={head} sx={{ color: textColor }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssues
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((issue) => (
                <TableRow
                  hover
                  key={issue.id}
                  sx={{ bgcolor: issue.status === "pending" ? pendingBg : "inherit" }}
                >
                  {/* Title - click to open modal */}
                  <TableCell
                    sx={{ cursor: "pointer", color: isDark ? "#90caf9" : "#1976d2" }}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    {issue.title}
                  </TableCell>

                  {/* Status Select */}
                  <TableCell>
                    <Select
                      value={issue.status}
                      onChange={(e) => updateStatus(issue.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 120, bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>{issue.priority}</TableCell>
                  <TableCell>{issue.category}</TableCell>

                  {/* Department Select */}
                  <TableCell>
                    <Select
                      value={issue.department || ""}
                      onChange={(e) => updateDepartment(issue.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 140, bgcolor: isDark ? "#2A2A2A" : "#FFF" }}
                      disabled={issue.status !== "pending"}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Department
                      </MenuItem>
                      <MenuItem value="IT">IT</MenuItem>
                      <MenuItem value="HR">HR</MenuItem>
                      <MenuItem value="Maintenance">Maintenance</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </TableCell>

                  {/* Assign button */}
                  <TableCell>
                    {issue.status === "pending" && (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={!issue.department}
                        onClick={() =>
                          alert(`Issue "${issue.title}" assigned to ${issue.department || "No Dept"}`)
                        }
                      >
                        Assign
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredIssues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Save button */}
      <div style={{ marginTop: "1rem" }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </Paper>
  );
}

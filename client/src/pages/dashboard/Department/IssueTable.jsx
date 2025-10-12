import React, { useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function IssueTable({ issues, getStatusColor, getStatusIcon }) {
  const { isDark } = useContext(ThemeContext);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleClose = () => setSelectedIssue(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  return (
    <>
      <Paper
        sx={{
          overflowX: "auto",
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: isDark ? "#1E1E2F" : "#fff",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {[
                "ID",
                "Title",
                "Category",
                "Reporter",
                "Status",
                "Department",
                "Created",
                "Actions",
              ].map((h) => (
                <TableCell key={h} sx={{ fontWeight: "bold", color: isDark ? "#aaa" : "#000" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.issue_id} hover>
                <TableCell sx={{ color: isDark ? "#fff" : "#000" }}>{issue.issue_id}</TableCell>
                <TableCell sx={{ color: isDark ? "#fff" : "#000" }}>{issue.title}</TableCell>
                <TableCell sx={{ color: isDark ? "#ccc" : "#555" }}>{issue.category}</TableCell>
                <TableCell sx={{ color: isDark ? "#ccc" : "#555" }}>
                  {issue.is_anonymous ? "Anonymous" : issue.reporter_name}
                </TableCell>

                {/* ✅ Editable Status with Select */}
                <TableCell>
                  <Select
                    size="small"
                    value={issue.status}
                    sx={{
                      backgroundColor: isDark ? "#2C2C3E" : "#f9f9f9",
                      color: isDark ? "#fff" : "#000",
                      minWidth: 100,
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </TableCell>

                {/* ✅ Editable Department if Pending */}
                <TableCell>
                  {issue.status === "Pending" ? (
                    <Select
                      size="small"
                      value={issue.department || ""}
                      sx={{
                        backgroundColor: isDark ? "#2C2C3E" : "#f9f9f9",
                        color: isDark ? "#fff" : "#000",
                        minWidth: 120,
                      }}
                    >
                      <MenuItem value="Public Works">Public Works</MenuItem>
                      <MenuItem value="Sanitation">Sanitation</MenuItem>
                      <MenuItem value="Electricity">Electricity</MenuItem>
                      <MenuItem value="Water">Water</MenuItem>
                    </Select>
                  ) : (
                    <Typography sx={{ color: isDark ? "#ccc" : "#555" }}>
                      {issue.department || "N/A"}
                    </Typography>
                  )}
                </TableCell>

                <TableCell sx={{ color: isDark ? "#ccc" : "#555" }}>
                  {new Date(issue.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ✅ Material UI Dialog for View */}
      <Dialog
        open={Boolean(selectedIssue)}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: isDark ? "#1E1E2F" : "#fff",
            color: isDark ? "#fff" : "#000",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Issue Details</DialogTitle>

        <DialogContent dividers>
          {selectedIssue && (
            <>
              {/* Dummy Image */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "15px",
                }}
              >
                <img
                  src="https://via.placeholder.com/400x250?text=Issue+Image"
                  alt="Issue"
                  style={{
                    borderRadius: "10px",
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <Typography variant="body1">
                <strong>Title:</strong> {selectedIssue.title}
              </Typography>
              <Typography variant="body1">
                <strong>Category:</strong> {selectedIssue.category}
              </Typography>
              <Typography variant="body1">
                <strong>Reporter:</strong>{" "}
                {selectedIssue.is_anonymous ? "Anonymous" : selectedIssue.reporter_name}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedIssue.status}
              </Typography>
              <Typography variant="body1">
                <strong>Department:</strong>{" "}
                {selectedIssue.department || "Not Assigned"}
              </Typography>
              <Typography variant="body1">
                <strong>Created:</strong>{" "}
                {new Date(selectedIssue.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Description:</strong>{" "}
                {selectedIssue.description || "No description provided."}
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

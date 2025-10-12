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
    <Paper sx={{ overflowX: "auto", borderRadius: 3, boxShadow: 3, backgroundColor: isDark ? "#1E1E2F" : "#fff" }}>
      <Table>
        <TableHead>
          <TableRow>
            {["ID", "Title", "Category", "Reporter", "Status", "Created", "Actions"].map((h) => (
              <TableCell key={h} sx={{ fontWeight: "bold", color: isDark ? "#aaa" : "#000" }}>{h}</TableCell>
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
              <TableCell>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  border: "1px solid",
                  ...getStatusColor(issue.status)
                }}>
                  {getStatusIcon(issue.status)}
                  <span style={{ marginLeft: 4 }}>{issue.status}</span>
                </span>
              </TableCell>
              <TableCell sx={{ color: isDark ? "#ccc" : "#555" }}>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => setSelectedIssue(issue)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

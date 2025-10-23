interface RowStatusProps {
  rowData: any;
  status: string;
}

export const RowStatus: React.FC<RowStatusProps> = ({ rowData, status }) => (
  <span
    className={`table-badge-comp ${
      rowData?.isArchived
        ? "archieve"
        : rowData?.isDraft
        ? "draft"
        : status === "active"
        ? "active"
        : status === "inactive"
        ? "inactive"
        : status === "live"
        ? "active"
        : rowData[status]?.toLowerCase() ?? "pending"
    }`}
    style={{ textTransform: "capitalize" }}
  >
    {rowData?.isArchived ? "archive" : rowData?.isDraft ? "draft" : status}
  </span>
);

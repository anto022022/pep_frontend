interface ArchiveStatusProps {
    rowData: any;
    status: string;
}

export const ArchiveStatus: React.FC<ArchiveStatusProps> = ({ rowData, status }) => (
    <span
        className={`table-badge-comp ${rowData?.isArchived
                ? "archieve"
                : rowData?.isDraft
                    ? "draft"
                    : rowData[status]?.toLowerCase() ?? "pending"
            }`}
    >
        {rowData?.isArchived
            ? "archive"
            : rowData?.isDraft
                ? "draft"
                : rowData[status] ?? "pending"}
    </span>
);

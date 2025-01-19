import StorageIcon from "@mui/icons-material/Storage";

const RepositoryName = ({ repoName }: { repoName: string }) => {
  return (
    <>
      <StorageIcon />
      &nbsp;{repoName}
    </>
  );
};

export default RepositoryName;

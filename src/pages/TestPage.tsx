import { Button } from "@mui/material";

const TestPage = () => {
  const handleTest = async () => {
    let data: FormData = new FormData();
    data.append("title", "TITLE");
    data.append("description", "DESCRIPTION");
    data.append("published", "false");

    // await axios.post("/create", data).then(() => console.log("CREATED"));
    await fetch("http://localhost:8081/api/create", {
      method: "POST",
      body: data,
    }).then(() => {
      console.log("DONE");
    });
  };

  return (
    <h1>
      TEST
      <Button onClick={handleTest}>Click Me</Button>
    </h1>
  );
};

export default TestPage;

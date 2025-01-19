import {
  Box,
  Button,
  createTheme,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import CreateIcon from "../icons/CreateIcon";
import { log } from "../utils/log";
import useDebugContext from "../hooks/useDebugContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useData, useTutopedia } from "../hooks/custom";
import { useEffect, useRef, useState } from "react";
import { Tutorial } from "../entities/tutorial";
import {
  DT_CREATE_PAGE,
  DT_CREATE_PAGE_CANCEL_BUTTON,
  DT_CREATE_PAGE_CREATE_BUTTON,
  DT_CREATE_PAGE_FILE_INPUT,
  DT_CREATE_PAGE_UPDATE_BUTTON,
  ID_CREATE_PAGE_CANCEL_BUTTON,
  ID_CREATE_PAGE_CREATE_BUTTON,
  ID_CREATE_PAGE_UPDATE_BUTTON,
  PCREATE,
  ROUTE_TUTORIALS,
  STTUTORIALS_ALL,
} from "../utils/constants";
import { HeaderBuilder } from "../builders/HeaderBuilder";
import { buildStateForStartup } from "../builders/builders";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, string } from "yup";

import { FaFileExport } from "react-icons/fa6";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSnackbar } from "notistack";
import axios from "axios";

const theme = createTheme({
  palette: {
    background: {
      paper: "#fff",
    },
    text: {
      primary: "#173A5E",
      secondary: "#0D3B69",
    },
    action: {
      active: "#001E3C",
    },
  },
});

const slotProps = {
  input: {
    color: "primary",
    sx: {
      borderBottom: "solid 1px #0D3B69",
    },
  },
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CreatePage = () => {
  const { debug } = useDebugContext();
  let { state } = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  log(debug, PCREATE, "In, State", state, true);

  const { count } = useTutopedia(state);

  const initialValues = {
    title: "",
    description: "",
    filename: "",
  };

  const [tutorial, setTutorial] = useState<Tutorial[]>();
  const file = useRef<any>(null);

  let { updateMode, updateId } = useData(state);

  if (updateMode) {
    log(debug, PCREATE, "UPDATE MODE");
  }

  if (updateId) {
    useEffect(() => {
      async function loadTutorial() {
        log(debug, PCREATE, "LOAD TUTORIAL", updateId);
        enqueueSnackbar("Loading Tutorial", { variant: "info" });
        await axios
          .get("/find/" + updateId)
          .then((response) => {
            if (response.data) {
              log(debug, PCREATE, "Found tutorial", response.data, true);
              setTutorial(response.data);
            }
          })
          .catch(function (error) {
            log(debug, PCREATE, "Find tutorial, Error", error.message);
            enqueueSnackbar("Error Finding Tutorial", { variant: "error" });
          });
      }

      log(debug, PCREATE, "Load Tutorial", updateId);
      loadTutorial();
    }, [updateId]);
  }

  const navigateToHome = (buttonName: string) => {
    log(debug, PCREATE, `Back to home with ${buttonName}`);
    const header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_ALL);
    state = buildStateForStartup({
      count: count + 1,
      routeUrl: ROUTE_TUTORIALS,
      sender: PCREATE,
      message: "Return from create",
      header: header.build(),
    });

    navigate(ROUTE_TUTORIALS, state);
  };

  const handleSubmitForm = async (values: any) => {
    log(debug, PCREATE, "Submit Form", values, true);
    if (updateMode) {
      let data: FormData = new FormData();
      data.append("title", values.title);
      data.append("description", values.description);
      if (file.current) {
        data.append("tutorialFile", file.current);
      }

      await fetch("http://localhost:8081/api/update/" + updateId, {
        method: "PUT",
        body: data,
      }).then(() => {
        enqueueSnackbar("Updating tutorial", { variant: "info" });
        navigateToHome(ID_CREATE_PAGE_UPDATE_BUTTON);
      });
    } else {
      let data: FormData = new FormData();
      data.append("title", values.title);
      data.append("description", values.description);
      data.append("published", "false");
      data.append("tutorialFile", file.current);

      // await axios.post("/create", data).then(() => console.log("CREATED"));
      await fetch("http://localhost:8081/api/create", {
        method: "POST",
        body: data,
      }).then(() => {
        enqueueSnackbar("Creating Tutorial", { variant: "info" });
        navigateToHome(ID_CREATE_PAGE_CREATE_BUTTON);
      });
    }
  };

  const setFileLabel = (value: string): void => {
    let fileLabel = document.getElementById("fileLabel");
    if (fileLabel) {
      fileLabel.innerHTML = value;
    }
  };

  const handleFileSelect = (evt: any) => {
    let selectedFile: any = evt.target.files?.item(0);
    if (selectedFile) {
      file.current = selectedFile;
      setFileLabel(selectedFile.name);
    }
  };

  const renderCreatePage = (): any => {
    log(debug, PCREATE, "RENDER TUTORIAL", tutorial, true);

    if (tutorial) {
      initialValues.title = tutorial[0].title!;
      initialValues.description = tutorial[0].description!;
      initialValues.filename = tutorial[0].filename!;
      log(debug, PCREATE, "Set Initial Tutorial values", initialValues, true);

      document
        .getElementById("hiddenInput")
        ?.addEventListener("change", handleFileSelect, false);
    }

    return (
      <ThemeProvider theme={theme}>
        <Box
          data-title={DT_CREATE_PAGE}
          overflow={"hidden"}
          sx={{
            width: "100%",
            height: "100%",
          }}
          marginTop={1}
        >
          <Formik
            enableReinitialize
            validationSchema={object({
              title: string()
                .required("Title is required")
                .max(255, "Maximal title length is 255 characters"),
              description: string()
                .required("Description is required")
                .max(255, "Maximal description length is 255 characters"),
              filename: string().when(
                "isUpdateMode",
                ([isUpdateMode], schema) => {
                  return isUpdateMode
                    ? schema.max(
                        255,
                        "Maximal filename length is 255 characters"
                      )
                    : schema
                        .required("File is required")
                        .max(255, "Maximal filename length is 255 characters");
                }
              ),
            })}
            initialValues={initialValues}
            validator={() => ({})}
            onSubmit={(values) => {
              handleSubmitForm(values);
            }}
          >
            {({ values, validateField, isSubmitting }) => (
              <>
                <Form>
                  <Box marginBottom={2}>
                    <FormGroup>
                      <Field
                        name="title"
                        as={TextField}
                        label="Title"
                        variant="standard"
                        slotProps={slotProps}
                      />
                    </FormGroup>
                    <ErrorMessage name="title">
                      {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                    </ErrorMessage>
                  </Box>

                  <Box marginBottom={2}>
                    <FormGroup>
                      <Field
                        name="description"
                        as={TextField}
                        value={values.description || ""}
                        multiline
                        rows={3}
                        label="Description"
                        variant="standard"
                        slotProps={slotProps}
                      />
                      <ErrorMessage name="description">
                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                      </ErrorMessage>
                    </FormGroup>
                  </Box>

                  <Box marginBottom={2}>
                    <FormGroup>
                      <span>
                        <FaFileExport /> Attachment: &nbsp;
                        <b style={{ color: "purple" }}>
                          <label id="fileLabel">{values.filename}</label>
                        </b>
                      </span>
                      <Box>
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload files
                          <VisuallyHiddenInput
                            data-title={DT_CREATE_PAGE_FILE_INPUT}
                            id="hiddenInput"
                            type="file"
                            onChange={(event) => {
                              let selectedFile: any =
                                event.target.files?.item(0);
                              if (selectedFile) {
                                file.current = selectedFile;
                                values.filename =
                                  event.target.files?.item(0)?.name!;
                                validateField("filename");
                              }
                            }}
                          />
                        </Button>
                        <ErrorMessage name="filename">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </Box>
                    </FormGroup>
                  </Box>

                  <Box
                    sx={{ textAlign: "center" }}
                    justifyContent="space-between"
                  >
                    <Button
                      data-title={
                        updateMode
                          ? { DT_CREATE_PAGE_UPDATE_BUTTON }
                          : { DT_CREATE_PAGE_CREATE_BUTTON }
                      }
                      id="createBtn"
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{ marginRight: "10px" }}
                    >
                      {updateMode ? "UPDATE" : "CREATE"}
                    </Button>
                    <Button
                      data-title={DT_CREATE_PAGE_CANCEL_BUTTON}
                      variant="contained"
                      onClick={() => {
                        navigateToHome(ID_CREATE_PAGE_CANCEL_BUTTON);
                      }}
                    >
                      CANCEL
                    </Button>
                  </Box>
                </Form>
              </>
            )}
          </Formik>
        </Box>
      </ThemeProvider>
    );
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box color="#FF0000" sx={{ marginTop: "5px" }}>
          <CreateIcon />
        </Box>
        <Box>
          <Typography variant="h5" color="#FF0000">
            {updateMode ? "Update tutorial" : "Create tutorial"}
          </Typography>
        </Box>
      </Box>
      <header>{renderCreatePage()}</header>
    </>
  );
};

export default CreatePage;

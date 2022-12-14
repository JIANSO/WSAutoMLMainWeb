import React, {useEffect, useReducer, useState} from 'react';
import {createMetadata, deleteMetadata, getMetadatas} from "../../../api/metadata";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Modal,
  styled,
  TextField
} from "@mui/material";

import {
  CATEGORY_THEME_MAP,
  COLUMNS,
  CREATOR_CONTACT_POINT_NAME_MAP,
  DEFAULT_PAGE_COUNT,
  DISPLAY_COUNT,
  LICENSE_RIGHTS_MAP,
  TYPES
} from "./constants";
import {DataGrid} from "@mui/x-data-grid";
import {getPreSignedUrl} from "../../../api/url";
import {uploadFileToS3} from "../../../api/file-storage/s3";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {matchDataGoKrUrl, scrapDataGoKr} from "../../../api/scrap/scrapDataGoKr";
import DataSetSelect from "./DataSetSelect";
import DataInfoContentText from "./DataInfoContentText";
import DataSetTextField from "./DataSetTextField";
import CatalogReducer from "./reducers/CatalogReducer";
import DataSetReducer from "./reducers/DataSetReducer";
import DistributionReducer from "./reducers/DistributionReducer";

export const INIT_CATALOG_ARGS = {
  themes: [],
};

export const INIT_DATASET_ARGS = {
  contactPointNames: [],
  rightses: [],
};

export const INIT_DISTRIBUTION_ARGS = {};

const Input = styled('input')({});

const centerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default function MetadataManagementContent() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(DEFAULT_PAGE_COUNT);

  const [inputLinkDialogOpen, setInputLinkDialogOpen] = useState(false);
  const [inputDataInfoDialogOpen, setInputDataInfoDialogOpen] = useState(false);

  const [progressBarOpend, setProgressBarOpend] = useState(false);
  const [fileUploadPercent, setFileUploadPercent] = useState(0);

  useEffect(() => {
    getMetadatas(DEFAULT_PAGE_COUNT, DISPLAY_COUNT)
      .then(it => {
        setData(it)
        setPage(DEFAULT_PAGE_COUNT)
      })
    // .catch(() => alert("???????????? ?????????????????? ?????????????????????."));
  }, [])

  const [catalogState, dispatchCatalog] = useReducer(CatalogReducer, INIT_CATALOG_ARGS)

  function onChangeCatalog(event) {
    dispatchCatalog({
      payload: event.target
    });
  }

  const [dataSetState, dispatchDataSet] = useReducer(DataSetReducer, INIT_DATASET_ARGS)

  function onChangeDataSet(event) {
    dispatchDataSet({
      payload: event.target
    });
  }

  const [distributionState, dispatchDistribution] = useReducer(DistributionReducer, INIT_DISTRIBUTION_ARGS)

  function onChangeDistribution(event) {
    dispatchDistribution({
      payload: event.target
    });
  }

  const totalDisplayedRowCount = (page + 1) * DISPLAY_COUNT;

  const [selectedIds, setSelectedIds] = React.useState([]);

  return (
    <>
      <Button
        id="uploadButton"
        variant="outlined" onClick={() => setInputLinkDialogOpen(true)}>
        ?????????
      </Button>
      <Button variant="outlined" color="error" sx={{
        margin: 2
      }} onClick={() => {
        if (selectedIds.length === 0) {
          return;
        }

        deleteMetadata(selectedIds)
          .then(() => {
            alert("?????? ??????")
            window.location.reload()
          })
      }
      }>
        ????????????
      </Button>
      <Typography variant="h6">
        ??????????????? ?????????
      </Typography>
      <Dialog open={inputLinkDialogOpen} onClose={closeInputLinkDialog}>
        <DialogTitle>URL ?????? ??????</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ??????????????? ????????? ?????? ???????????? ????????? URL??? ??????????????????.
          </Typography>
          <DialogContentText>
            * ??????????????? ?????? ????????? ???????????? Url ????????? ????????? ????????????.
          </DialogContentText>
          <DialogContentText>
            - '???????????? ??????????????? ??????>??????'
          </DialogContentText>
          <DialogContentText>
            - '????????????????????????>????????????>??????'
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="sourceUrl"
            label="URL ?????? ??????"
            fullWidth
            variant="standard"
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id="linkCheckBox"
                  onChange={setSourceUrlState}
                />
              }
              label="?????? ??????"/>
          </FormGroup>

        </DialogContent>
        <DialogActions>
          <Button onClick={closeInputLinkDialog}>??????</Button>
          <Button
            id="linkInputNextButton"
            onClick={handleInputLinkDialogNext}>??????</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={inputDataInfoDialogOpen} onClose={closeDataInfoDialog}>
        <DialogTitle>????????? ?????? ??????</DialogTitle>
        <DialogContent>

          <DataInfoContentText name="????????????"/>
          <DataSetSelect
            name={{eng: 'category', kor: '* ????????????'}}
            onChange={onChangeCatalog}
            list={Object.keys(CATEGORY_THEME_MAP)}
            value={catalogState.category}
          />
          <DataSetSelect
            name={{eng: 'theme', kor: '* ??????'}}
            onChange={onChangeCatalog}
            list={catalogState.themes}
            value={catalogState.theme}
          />
          <DataSetTextField
            name={{eng: 'themeTaxonomy', kor: '?????? ??????'}}
            onChange={onChangeCatalog}
            value={catalogState.themeTaxonomy}
          />

          <DataInfoContentText name="????????????"/>
          <DataSetTextField
            name={{eng: 'title', kor: '* ??????'}}
            value={dataSetState.title}
            onChange={onChangeDataSet}
          />
          <DataSetTextField
            name={{eng: 'publisher', kor: '* ?????? ??????'}}
            value={dataSetState.publisher}
            onChange={onChangeDataSet}
          />
          <DataSetSelect
            name={{eng: 'creator', kor: '* ?????? ??????'}}
            onChange={onChangeDataSet}
            list={Object.keys(CREATOR_CONTACT_POINT_NAME_MAP)}
            value={dataSetState.creator}
          />
          <DataSetSelect
            name={{eng: 'contactPointName', kor: '* ????????? ??????'}}
            onChange={onChangeDataSet}
            list={dataSetState.contactPointNames}
            value={dataSetState.contactPointName}
          />
          <DataSetSelect
            name={{eng: 'type', kor: '* ??????'}}
            onChange={onChangeDataSet}
            list={TYPES}
            value={dataSetState.type}
          />
          <DataSetTextField
            name={{eng: 'keyword', kor: '* ?????????'}}
            value={dataSetState.keyword}
            onChange={onChangeDataSet}
          />
          <DataSetSelect
            name={{eng: 'license', kor: '* ????????????'}}
            onChange={onChangeDataSet}
            list={Object.keys(LICENSE_RIGHTS_MAP)}
            value={dataSetState.license}
          />
          <DataSetSelect
            name={{eng: 'rights', kor: '* ??????'}}
            onChange={onChangeDataSet}
            list={dataSetState.rightses}
            value={dataSetState.rights}
          />
          <DataSetTextField
            name={{eng: 'description', kor: '* ??????'}}
            value={dataSetState.description}
            onChange={onChangeDataSet}
          />

          <DataInfoContentText name="??????"/>
          <TextField
            id="distribution-title-text-field"
            label="* ??????"
            variant="filled"
            fullWidth
            disabled
            value="?????? ????????? ??? ???????????? ???????????????"
          />

          <DataSetTextField
            name={{eng: 'description', kor: '??????'}}
            onChange={onChangeDistribution}
            value={distributionState.description}
          />

          <TextField
            id="downloadUrl-text-field"
            label="* ???????????? URL"
            variant="filled"
            fullWidth
            disabled
            value="?????? ????????? ??? ???????????? ???????????????"
          />

          <DataSetTextField
            name={{eng: 'temporalResolution', kor: '* ?????? ??????(ex. 1???, 5???, 15???, 30???, 1??????, 6??????, 1???)'}}
            onChange={onChangeDistribution}
            value={distributionState.temporalResolution}
          />

          <DataSetTextField
            name={{eng: 'accurualPeriodicity', kor: '?????? ??????'}}
            onChange={onChangeDistribution}
            value={distributionState.accurualPeriodicity}
          />
          <DataSetTextField
            name={{eng: 'spatial', kor: '?????? ??????'}}
            onChange={onChangeDistribution}
            value={distributionState.spatial}
          />
          <DataSetTextField
            name={{eng: 'temporal', kor: '?????? ??????'}}
            onChange={onChangeDistribution}
            value={distributionState.temporal}
          />

          <label htmlFor="file">
            <Input
              accept=".csv"
              id="file"
              type="file"
              onChange={onChangeDistribution}
            />
          </label>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDataInfoDialogPrevious}>????????????</Button>
          <Button onClick={closeDataInfoDialog}>??????</Button>
          <Button
            id="finishButton"
            onClick={handleFinish}>??????</Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={progressBarOpend}
        onClose={!progressBarOpend}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          ...centerStyle,
        }}
      >
        <Box sx={{
          backgroundColor: 'white',
          ...centerStyle
        }}>
          <CircularProgress variant="determinate" value={fileUploadPercent}/>
          <Box
            sx={{
              position: 'absolute',
              ...centerStyle,
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {fileUploadPercent}%
            </Typography>
          </Box>
        </Box>
      </Modal>


      <DataGrid
        rows={parseToRows(data)}
        rowCount={totalDisplayedRowCount + 1} // ?????? ???????????? ????????? ??? ?????? ?????? ??? ??????
        columns={COLUMNS}
        page={page}
        pageSize={DISPLAY_COUNT}
        rowsPerPageOptions={[DISPLAY_COUNT]}
        checkboxSelection={true}
        disableSelectionOnClick
        paginationMode="server" // ???????????? ????????????????????? ??????????????? ?????? ??????
        onPageChange={newPage => {
          getMetadatas(newPage, DISPLAY_COUNT)
            .then(it => {
              setData(it)
              setPage(newPage)
            })
        }}
        initialState={{
          pagination: {
            page: DEFAULT_PAGE_COUNT
          }
        }}
        onSelectionModelChange={(ids) => {
          setSelectedIds(ids);
        }}
      />
    </>
  );

  /**
   * data grid?????? row??? ?????? ??? ????????? ???????????????.
   */
  function parseToRows(metadatas) {
    return metadatas.map(metadata => {
      return {
        ...metadata.catalog,
        ...metadata.dataSet,
        ...metadata.dataSet.organization,
        ...metadata.dataSet.organization.contactPoint,
        ...metadata.dataSet.licenseInfo,
        ...metadata.distribution,

        // dataSet??? distribution??? title??? description??? ???????????? ???????????? ??????
        dataSetTitle: metadata.dataSet.title,
        dataSetDescription: metadata.dataSet.description,
        distributionTitle: metadata.distribution.title,
        distributionDescription: metadata.distribution.description,
      }
    });
  }

  async function handleInputLinkDialogNext() {
    const url = document.getElementById("sourceUrl").value;

    if (url.startsWith("http://data.ex.co.kr")) {
      dispatchCatalog({
        type: "data.ex.co.kr"
      })

      const dispatches = [dispatchDataSet, dispatchDistribution];

      if (url === "http://data.ex.co.kr/portal/fdwn/view?type=ETC&num=79&requestfrom=dataset") {
        dispatches.forEach(it => it({
          type: "data-ex-79"
        }))
      }
      if (url === "http://data.ex.co.kr/portal/fdwn/view?type=ETC&num=78&requestfrom=dataset") {
        dispatches.forEach(it => it({
          type: 'data-ex-78'
        }))
      }
      if (url === "http://data.ex.co.kr/portal/fdwn/view?type=VDS&num=38&requestfrom=dataset") {
        dispatches.forEach(it => it({
          type: 'data-ex-38'
        }))
      }
      if (url === "http://data.ex.co.kr/portal/fdwn/view?type=VDS&num=23&requestfrom=dataset") {
        dispatches.forEach(it => it({
          type: 'data-ex-23'
        }))
      }
    }

    //?????? ?????? ??????
    if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS")) {
      dispatchCatalog({
        type: "ex/tcs"
      })

      const dispatches = [dispatchDataSet]

      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=34")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/34'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=35")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/35'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=32")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/32'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=31")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/31'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=39")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/39'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=65")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/65'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=64")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/64'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=C7")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/C7'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=17")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/17'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=33")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/33'
        }))
      }
      //????????? ??????
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=67")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/67'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=C5")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/C5'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=18")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/18'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B6")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B6'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B1")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B1'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B5")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B5'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B3")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B3'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=68")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/68'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B4")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B4'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B2")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B2'
        }))
      }
      //????????? ??????
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B7")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B7'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=C2")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/C2'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=C4")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/C4'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=C3")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/C3'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=66")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/66'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=A2")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/A2'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=B9")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/B9'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=C0")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/C0'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=A5")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/A5'
        }))
      }
      if (url.startsWith("http://data.ex.co.kr/portal/fdwn/view?type=TCS&num=69")) {
        dispatches.forEach(it => it({
          type: 'ex/tcs/69'
        }))
      }


    }
    //?????? ?????? ??????

    if (url === "https://data.kma.go.kr/data/grnd/selectAsosRltmList.do?pgmNo=36&tabNo=1") {
      [dispatchCatalog, dispatchDataSet].forEach(it => it({
        type: 'data-kma-36'
      }))
    }

    // kma ?????? ??????
    if (url.startsWith("https://data.kma.go.kr")) {
      dispatchCatalog({
        type: "kma"
      })

      const dispatches = [dispatchDataSet];

      if (url === "https://data.kma.go.kr/data/grnd/selectAsosRltmList.do?pgmNo=36") {
        dispatches.forEach(it => it({
          type: "kma/grnd_Asos"
        }))
      }

      if (url === "https://data.kma.go.kr/data/grnd/selectAwsRltmList.do?pgmNo=56") {
        dispatches.forEach(it => it({
          type: "kma/grnd_Aws"
        }))
      }

      if (url === "https://data.kma.go.kr/data/grnd/selectAgrRltmList.do?pgmNo=72") {
        dispatches.forEach(it => it({
          type: "kma/grnd_Agr"
        }))
      }

      if (url === "https://data.kma.go.kr/data/grnd/selectNkRltmList.do?pgmNo=58") {
        dispatches.forEach(it => it({
          type: "kma/grnd_Nk"
        }))
      }

      if (url === "https://data.kma.go.kr/data/grnd/selectAwosRltmList.do?pgmNo=638") {
        dispatches.forEach(it => it({
          type: "kma/grnd_Awos"
        }))
      }

      if (url === "https://data.kma.go.kr/data/seasonObs/seasonObsDataList.do?pgmNo=648") {
        dispatches.forEach(it => it({
          type: "kma/season"
        }))
      }

      if (url === "https://data.kma.go.kr/data/seasonObs/seasonObsDataList.do?pgmNo=648&tabNo=1") {
        dispatches.forEach(it => it({
          type: "kma/season_Obs"
        }))
      }

      if (url === "https://data.kma.go.kr/data/climate/selectDustRltmList.do?pgmNo=68") {
        dispatches.forEach(it => it({
          type: "kma/climate"
        }))
      }

      if (url === "https://data.kma.go.kr/data/lightning/lightningRltmList.do?pgmNo=641") {
        dispatches.forEach(it => it({
          type: "kma/lightning"
        }))
      }
    }
    // kma ?????? ??????

    if (matchDataGoKrUrl(url)) {
      const payload = await scrapDataGoKr(url);

      [dispatchDataSet, dispatchDistribution].forEach(it => it({
        type: 'data.go.kr',
        payload
      }))
    }

    closeInputLinkDialog();
    openDataInfoDialog();
  }

  function openDataInfoDialog() {
    setInputDataInfoDialogOpen(true);
  }

  function closeInputLinkDialog() {
    setInputLinkDialogOpen(false);
  }

  function setSourceUrlState() {
    const sourceUrl = document.getElementById("sourceUrl")
    const disabled = sourceUrl.getAttribute("disabled");

    if (disabled === null) {
      sourceUrl.setAttribute("disabled", "")
      sourceUrl.value = "";
    } else {
      sourceUrl.removeAttribute("disabled");
    }

  }

  function closeDataInfoDialog() {
    setInputDataInfoDialogOpen(false);

    clearAllStates();
  }

  function handleDataInfoDialogPrevious() {
    setInputDataInfoDialogOpen(false);
    clearAllStates();

    setInputLinkDialogOpen(true);
  }

  function clearAllStates() {
    [dispatchCatalog, dispatchDataSet, dispatchDistribution].forEach(it => {
      it({
        type: "clear"
      })
    })
  }

  async function handleFinish() {
    const file = document.getElementById("file").files[0];
    if (file === undefined) {
      alert("????????? ????????? ????????????.");
      return;
    }

    const preSignedUrl = await getPreSignedUrl(file.name);
    const downloadUrl = preSignedUrl.split("?")[0];

    const createMetadataAttributes = {
      catalog: {
        ...catalogState
      },
      dataset: {
        ...dataSetState
      },
      distribution: {
        ...distributionState,
        title: file.name,
        downloadUrl
      }
    }

    createMetadata(createMetadataAttributes)
      .then(() => displayProgressBar())
      .then(() => uploadFileToS3(preSignedUrl, file, setFileUploadPercent))
      .then(() => {
        closeProgressBar();
        // alert("?????? ??????")
        window.location.reload();
      })
      .catch(err => {
        if (err.response.data.errors) {
          alert(err.response.data.errors[0].defaultMessage);
          return;
        }

        if (err.response.data.message) {
          alert(err.response.data.message);
          return;
        }

        alert("????????? ?????? ????????? ??????????????????. ??????????????? ???????????????");
      })

  }

  function displayProgressBar() {
    setProgressBarOpend(true);
  }

  function closeProgressBar() {
    setProgressBarOpend(false);
  }

}

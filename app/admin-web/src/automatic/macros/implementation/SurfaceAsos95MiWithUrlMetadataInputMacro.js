import WithUrlMetadataInputMacro from "../abstract/WithUrlMetadataInputMacro";

const FILE_NAME = "files/SURFACE_ASOS_95_MI_2022-01_2022-01_2022.csv";
const URL = "https://data.kma.go.kr/data/grnd/selectAsosRltmList.do?pgmNo=36&tabNo=1";

class SurfaceAsos95MiWithUrlMetadataInputMacro extends WithUrlMetadataInputMacro {
  constructor(page) {
    super(page, URL, FILE_NAME);
  }
}

export default SurfaceAsos95MiWithUrlMetadataInputMacro;

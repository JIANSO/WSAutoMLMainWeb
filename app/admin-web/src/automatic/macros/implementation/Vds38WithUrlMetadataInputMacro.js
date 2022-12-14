import WithUrlMetadataInputMacro from "../abstract/WithUrlMetadataInputMacro";

const FILE_NAME = "files/VDS_38_01_01_210028.csv";
const URL = "http://data.ex.co.kr/portal/fdwn/view?type=VDS&num=38&requestfrom=dataset";

class Vds38WithUrlMetadataInputMacro extends WithUrlMetadataInputMacro {
  constructor(page) {
    super(page, URL, FILE_NAME);
  }
}

export default Vds38WithUrlMetadataInputMacro;

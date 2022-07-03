package kr.co.automl.domain.metadata.dto;

import kr.co.automl.domain.metadata.domain.dataset.DataSet;
import lombok.Builder;

public record MetadataResponse(
        CatalogResponse catalog,
        DataSetResponse dataSet,
        DistributionResponse distribution
) {

    @Builder
    public MetadataResponse {
    }

    public static MetadataResponse from(DataSet dataSet) {
        return MetadataResponse.builder()
                .catalog(dataSet.getCatalog().toResponse())
                .dataSet(dataSet.toResponse())
                .distribution(dataSet.getDistribution().toResponse())
                .build();
    }
}

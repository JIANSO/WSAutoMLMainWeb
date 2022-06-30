package kr.co.automl.domain.metadata.catalog;

import kr.co.automl.domain.metadata.catalog.dto.CreateCatalogAttributes;
import org.junit.jupiter.api.Test;

import static kr.co.automl.domain.metadata.dataset.DataSetTest.DATA_SET1;
import static org.assertj.core.api.Assertions.assertThat;

class CatalogTest {

    @Test
    void from_생성_테스트() {
        CreateCatalogAttributes createCatalogAttributes = CreateCatalogAttributes.builder()
                .name("대기 환경")
                .theme("공기질")
                .themeTaxonomy("themeTaxonomy")
                .dataSet(DATA_SET1)
                .build();

        Catalog catalog = Catalog.from(createCatalogAttributes);

        assertThat(catalog.getCategory()).isEqualTo(Category.ATMOSPHERIC_ENVIRONMENT);
        assertThat(catalog.getTheme()).isEqualTo(Theme.AIR_QUALITY);
        assertThat(catalog.getThemeTaxonomy()).isEqualTo("themeTaxonomy");
        assertThat(catalog.getDataSet()).isEqualTo(DATA_SET1);
    }
}

export class CommunicationWithServer {
    static tankApi = "api/Cistern";
    static calculatorApi = "api/Calculator";
    static structuralAnalysisApi = "api/StructuralAnalysis"

    static async GetRequest(request) {
        const response = await fetch(request);

        if (response.ok) {
            const data = await response.json();

            return data;
        }

        return null;
    }

    static async GetCinsternList() {
        const data = this.GetRequest(this.tankApi);

        return data;
    }

    static async GetCisternCharacters(cisternId) {
        const data = this.GetRequest(this.tankApi + "/CisternCharacters?cisternId=" + cisternId);

        return data;
    }


    static async GetProductParks() {
        const data = this.GetRequest(this.calculatorApi + "/GetProductParks");

        return data;
    }

    static async GetCisternPurposeList() {
        const data = this.GetRequest(this.calculatorApi + "/GetCisternPurposes");

        return data;
    }

    static async GetCisternPurposesByOilType(oilType) {
        const data = this.GetRequest(this.calculatorApi + "/GetCisternPurposesForOilType?oilType=" + oilType);

        return data;
    }

    static async GetOilTypes() {
        const data = this.GetRequest(this.calculatorApi + "/GetOilTypes");

        return data;
    }

    static async GetCalculationResultByArguments(cisternPurposeId, oilType, oilValue, waterValue, groupSelect = false, needCount = 20) {
        const data = this.GetRequest(this.calculatorApi + "/CalculateByValues?" +
            "CisternPurposeId=" + cisternPurposeId + "&" +
            "oilType=" + oilType + "&" +
            "oilValue=" + oilValue + "&" +
            "waterValue=" + waterValue + "&" +
            "needCount=" + needCount + "&" +
            "groupSelect=" + groupSelect);

        return data;
    }

    static async GetCalculationResultByProductPark(productParkId, cisternPurposeId, groupSelect = false, needCount = 20) {
        const data = this.GetRequest(this.calculatorApi + "/CalculateByProductPark?" +
            "productParkId=" + productParkId + "&" +
            "CisternPurposeId=" + cisternPurposeId + "&" +
            "needCount=" + needCount + "&" +
            "groupSelect=" + groupSelect);

        return data;
    }

    static async GetFormTypes() {
        const data = this.GetRequest(this.structuralAnalysisApi + "/GetFormTypes");

        return data;
    }

    static async GetStructuralAnalysisResultByForm(volumeValue, formTypeIndex, limites) {
        const data = this.GetRequest(this.structuralAnalysisApi + "/AnalyseByFormVolume?" +
            "volumeValue=" + volumeValue + "&" + 
            "formTypeIndex=" + formTypeIndex + "&" +
            "limitesAsString=" + limites);

        return data;
    }
}
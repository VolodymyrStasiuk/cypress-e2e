const { onDatepickerPage } = require("../support/page_objects/datepickerPage")
const { onFormLayoutsPage } = require("../support/page_objects/formLayoutsPage")
const { navigateTo } = require("../support/page_objects/navigationPAge")
const { onSmartTablePage } = require("../support/page_objects/smartTablePage")

describe('Test with Page Objects', () => {
    beforeEach('Open home page', () => {
    cy.openHomePage()
    })
    it('verify navigation across the pages', () => {
        navigateTo.formLayoutsPage()
        navigateTo.datepickerPage()
        navigateTo.smartTablesPage()
        navigateTo.toasterPage()
        navigateTo.tooltipPage()
    })
    it.only('Fill inline form', () => {
        navigateTo.formLayoutsPage()
        onFormLayoutsPage.submitInlineFormWithNameandEmail('stas', 's@s.s')
        navigateTo.datepickerPage()
        onDatepickerPage.selectCommonDatepickerDateFromToday(1)
        onDatepickerPage.selectDatepickerWithRangeFromToday(0, 7)
        navigateTo.smartTablesPage()
        onSmartTablePage.addNewRecordWithFirstAndLastName('Vova', 'Stas')
        onSmartTablePage.updateAgeByFirstName('Vova', '99')
        onSmartTablePage.deleteRowByIndex(1)
    })
})
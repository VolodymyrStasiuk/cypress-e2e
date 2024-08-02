function selectGroupMenuItem(groupName){
    cy.contains('a', groupName).then(menu => {
        cy.wrap(menu).find('.expand-state')
        .invoke('attr', 'ng-reflect-icon')
        .then(attr => {
            if(attr.includes('left')) {
                cy.wrap(menu).click()
            }
        })
    })
}
export class NavigationPage{
    formLayoutsPage() {
        selectGroupMenuItem('Forms')
        cy.contains('Form Layouts').click()
    }
    datepickerPage() {
        selectGroupMenuItem('Forms')
        cy.contains('Datepicker').click()
    } 
    toasterPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Toastr').click()
    }
    smartTablesPage() {
        selectGroupMenuItem('Tables & Data')
        cy.contains('Smart Table').click()
    }
    tooltipPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Tooltip').click()
    }
}
export const navigateTo = new NavigationPage()
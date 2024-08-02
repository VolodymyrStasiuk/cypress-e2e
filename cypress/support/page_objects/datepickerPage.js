function selectDayFromCurrent(day){
    let date = new Date()
    date.setDate(date.getDate() + day)
    let futureDay = date.getDate()
    let futureMonth = date.toLocaleDateString('en-US', {month: 'short'})
    let futureYear = date.getFullYear()
    let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`
    console.log("Date To Assert: " + dateToAssert)
        cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date')
        .then(dateAttribute => {
            if(!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)){
                cy.get('[data-name="chevron-right"]').click()
                selectDayFromCurrent(day)
            }else {
                cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
            }
        })
        return dateToAssert
    }

export class DatepickerPage{

    selectCommonDatepickerDateFromToday(dayFromToday){
        cy.contains('nb-card', 'Common Datepicker').find('input')
        .then(input => {
            cy.wrap(input).click()
            let dateToAssert = selectDayFromCurrent(dayFromToday)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
            cy.wrap(input).should('have.value', dateToAssert)
        })
    }
    selectDatepickerWithRangeFromToday(firstDate, secondDay){
        cy.contains('nb-card', 'Datepicker With Range').find('input')
        .then(input => {
            cy.wrap(input).click()
            let firstDateToAssert = selectDayFromCurrent(firstDate)
            let secondDateToAssert = selectDayFromCurrent(secondDay)
            const finalDateRange = firstDateToAssert+' - '+secondDateToAssert
            cy.wrap(input).invoke('prop', 'value').should('contain', finalDateRange)
            cy.wrap(input).should('have.value', finalDateRange)
        })
    }
}

export const onDatepickerPage = new DatepickerPage()
/// <reference types="cypress" />

const { table } = require("console")
const { toNamespacedPath } = require("path")

describe('Define test suite description, Forms > Layouts ', () => {
    beforeEach('Precondition: Open test page', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
    })
    it('Type of locators', () => {
        //by tag name
        cy.get('input')
        //by id
        cy.get('#inputEmail1')
        //by class value
        cy.get('.input-full-width')
        //by Attribute name
        cy.get('[fullWidth]')
        //by attribute and value
        cy.get('[placeholder="Email"]')
        //by entire class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')
        //several locators
        cy.get('[placeholder="Email"][fullWidth].input-full-width')
        //cypress test id
        cy.get('[data-cy="imputEmail1"]')
    })
    it('Find element', () => {
        //theory
        // get() - find globally by locator
        // contains() - find element by HTML text and by text and locator
        // find() - find child elements by locator
        cy.contains('[status="warning"]', 'Sign in')
        cy.contains('nb-card', 'Horizontal form').find('button')
        cy.contains('nb-card', 'Horizontal form').contains('Sign in')
        //cypress chains and DOM
        cy.get('#inputEmail3')
        .parents('form')
        .find('button')
        .should('contain', 'Sign in')
        .parents('form')
        .find('nb-checkbox')
        .click()
    })
    it('Saving subject to the command(Assertions . should)', () => {
        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]')
        .should('contain', 'Email')
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]')
        .should('contain', 'Password')

        //Cypress Alias '.as()'
        //Like global variable, can call later in the test
        cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]')
        .should('contain', 'Password')

        //Cypress then() method. not chain able, jQuery type element, 
        //visible only inside then function
        cy.contains('nb-card', 'Using the Grid').then(usingTheGridForm => {
            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]')
            .should('contain', 'Email')
        })
    })
    it('Extract text values', () => {
        //Chai like assertion, only in the jQuery type
        //getting value and saving it in the constant
        cy.get('[for="exampleInputEmail1"]').then( lable => {
            const lableText = lable.text()
            expect(lableText).to.equal('Email address')
            cy.wrap(lableText).should('contain', 'Email address')
        })
        //cypress method .invoke
        cy.get('[for="exampleInputEmail1"]').invoke('text').then ( text => {
            expect(text).to.equal('Email address')
        })
        cy.get('[for="exampleInputEmail1"]').invoke('text')
        .should('contain', 'Email address')
        // invoke class name
        cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class')
        .then(classValue => {
            expect(classValue).to.equal('label')
        })
        //invoke property
        cy.get('#exampleInputEmail1').type('stas')
        cy.get('#exampleInputEmail1').invoke('prop', 'value')
        .should('contain', 'stas')
    })
    it('Radio buttons', () => {
        // Type radio or type checkbox
        //.eq(0) - select by index
        //({force: true}) - disable cypress check for element 
        //to be visible/clickable
        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]')
        .then( radioButtons => {
            cy.wrap(radioButtons).eq(0).check({force: true})
            .should('be.checked')
            cy.wrap(radioButtons).eq(1).check({force: true})
            cy.wrap(radioButtons).eq(0).should('not.be.checked')
            cy.wrap(radioButtons).eq(2).should('be.disabled')
        })
    })
})

describe('Test suite: checkboxes, ', () => {
    beforeEach('Precondition: Modal & Overlays > Toastr', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()
    })
    it('Checkboxes', () => {
        //method check verifies state of the checkbox
        //only if checkbox unselected it will select checkbox
        cy.get('[type="checkbox"]').check({force: true})
        //unched all selected checkboxes
        cy.get('[type="checkbox"]').uncheck({force: true})
        //click on the first checkbox
        //click method doesn't care aboutthe state of the checkbox
        cy.get('[type="checkbox"]').eq(0).click({force: true})
        cy.get('[type="checkbox"]').eq(1).check({force: true})
    })
})
describe('Test suite: datepicker, ', () => {
    beforeEach('Precondition: Forms > Datepicker', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()
    })
    it('Datepickers', () => {
        cy.contains('nb-card', 'Common Datepicker').find('input')
        .then(input => {
            cy.wrap(input).click()
            //click untill month is correct
            function selectDayFromCurrent(day){
            //find current date +1
            //date.setDate(date.getDate() + 1)
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
            //Find all dates and exlude inactive ones
             const dateToAssert = selectDayFromCurrent(20)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert)
            //another way to verify expected result
            cy.wrap(input).should('have.value', dateToAssert)
        })
    })
})
describe('Test suite: List and dropdowns, ', () => {
    it('List', () => {
        cy.visit('/')
        //Combine perent and childe inside get
        //same as 
        //cy.get('nav').find('nb-select').click()
        cy.get('nav nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')
        //loop through list of items
        cy.get('nav nb-select').then(dropDown => {
            cy.wrap(dropDown).click()
            cy.get('.options-list nb-option').each((listItem, index) => {
                const  itemText = listItem.text().trim()
                cy.wrap(listItem).click()
                cy.wrap(dropDown).should('contain', itemText)
                if(index < 3){
                    //click to expand the list and element is present on the DOM
                    cy.wrap(dropDown).click()
                }
            })
        })
    })
})
describe('Test suite: Tables, ', () => {
    beforeEach('Precondition: Tables > Smart Table', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
    })
    it('Tables', () => {
        //Get the row of the table by text
        cy.get('tbody').contains('tr', 'Larry').then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
        })
        //Get row by Index
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Stas')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Stas')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then(tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', 'Stas')
            cy.wrap(tableColumns).eq(3).should('contain', 'Stas')
        })

    })
    //Loop each row of the table, filtering
    it('Loop through table', () => {
        const age = [20, 30, 40, 200]
        //test data
        cy.wrap(age).each(age => {
            cy.get('thead [placeholder="Age"]' ).clear().type(age)
            cy.wait(500)
            cy.get('tbody tr').each(tableRows => {
                if(age == 200){
                    cy.wrap(tableRows).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRows).find('td').eq(6).should('contain', age)
                }
                    })
                })
        })
})
describe('Test suite: Tooltip, ', () => {
    beforeEach('Precondition: Tables > Smart Table', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()
    })
    it('Tooltip', () => {
        cy.contains('nb-card', 'Colored Tooltips')
        .contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')
    })
    it.only('Browser dialog', () => {
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
        //Get access to the browser dialog
        //Will not fail if dialog is not there
        cy.get('tbody tr').first().find('.nb-trash').click()
        //To press Cancel on the dialog
        //cy.on('window:confirm', () => (false)
        cy.on('window:confirm', (confirm) => {
            expect(confirm).to.equal('Are you sure you want to delete?')
        })
        //If dialog windows do not show up stub const will be empty
        //and get call will not have a message
        const stub = cy.stub()
        cy.on('window:confirm', stub)
        cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })
    })
})
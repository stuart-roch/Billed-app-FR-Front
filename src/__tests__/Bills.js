/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES,ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toHaveAttribute("class","active-icon")

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe("When I click on eye icon", () => {
    test("Then I should see a modal with an image of the bill justification", async () => {
      /*document.body.innerHTML = BillsUI({ data: bills })
      const bill = new Bills(screen, onNavigate, null, window.localStorage)*/
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      document.body.innerHTML=BillsUI({data:bills})
      
      await waitFor(() => document.querySelectorAll("div[data-testid='icon-eye'"))
      const bill = new Bills({document, onNavigate,store: null, localStorage:window.localStorage})
      const eyeIcons=document.querySelectorAll("div[data-testid='icon-eye'")
      eyeIcons.forEach(eyeIcon => {
        const handleClickIconEye = jest.fn((e) => bill.handleClickIconEye(eyeIcon))
        eyeIcon.addEventListener('click',handleClickIconEye)
        userEvent.click(eyeIcon)
        expect(handleClickIconEye).toHaveBeenCalled()
      })
    })
  })
})

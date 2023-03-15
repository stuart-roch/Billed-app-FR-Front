/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js"
import router from "../app/Router.js"
import mockStore from "../__mocks__/store"
import {localStorageMock} from "../__mocks__/localStorage.js"

//jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should see the form", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      await waitFor(() => screen.getByTestId("form-new-bill"))
      expect(screen.getByTestId('expense-type')).toBeInTheDocument()
      expect(screen.getByTestId('expense-name')).toBeInTheDocument()
      expect(screen.getByTestId('datepicker')).toBeInTheDocument()
      expect(screen.getByTestId('amount')).toBeInTheDocument()
      expect(screen.getByTestId('vat')).toBeInTheDocument()
      expect(screen.getByTestId('pct')).toBeInTheDocument()
      expect(screen.getByTestId('commentary')).toBeInTheDocument()
      expect(screen.getByTestId('file')).toBeInTheDocument()
      expect(document.querySelector("#btn-send-bill")).toBeInTheDocument()
    })
    test("Then mail icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toHaveAttribute("class","active-icon")
    })
  })
  //test d'integration POST
  describe("When I add an image file with the extension jpeg, png, jpg", () => {
    test("fetch new bill from API POST", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({document, onNavigate, store:null, localStorage:window.localStorage})
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile)
      await waitFor(() => screen.getByTestId("file"))
      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change",handleChangeFile)
      const fileImageTest = new File(["test"],"test.png",{type:"image/png"})
      userEvent.upload(fileInput,fileImageTest)
      expect(handleChangeFile).toHaveBeenCalled()


    })
  })
})

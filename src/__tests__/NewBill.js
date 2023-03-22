/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import router from "../app/Router.js"
import store from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js"




describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should see the form", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
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
      const logSpy=jest.spyOn(console,'log')
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({document, onNavigate, store, localStorage:window.localStorage})
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile)
      await waitFor(() => screen.getByTestId("file"))
      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change",handleChangeFile)
      const fileImageTest = new File(["test"],"test.png",{type:"image/png"})
      userEvent.upload(fileInput,fileImageTest)
      await expect(handleChangeFile).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith("https://localhost:3456/images/test.jpg")
    })
  })
  describe("When I upload a file with the wrong extension", () => {
    test("Then I should see an error message telling that the extension is incorrect", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({document, onNavigate, store, localStorage:window.localStorage})
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile)
      await waitFor(() => screen.getByTestId("file"))
      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change",handleChangeFile)
      const fileDocTest = new File(["test"],"test.doc")
      userEvent.upload(fileInput,fileDocTest)
      await expect(handleChangeFile).toHaveBeenCalled()
      expect(fileInput.parentElement).toHaveAttribute("data-error-visible","true")
      expect(fileInput.parentElement).toHaveAttribute("data-error-msg","Veuillez choisir un fichier dont l'extension est png, jpeg ou jpg")
    })
  })
  describe("When I fill the form and click on Send", () => {
    test("Then I should be redirected to Bills Page", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({document, onNavigate, store, localStorage:window.localStorage})
      const handleSubmit = jest.fn((e) => newBill.handleSubmit)
      await waitFor(() => screen.getByTestId("form-new-bill"))
      const form = screen.getByTestId("form-new-bill")
      form.addEventListener("submit",handleSubmit)
      userEvent.click(document.querySelector("#btn-send-bill"))
      expect(handleSubmit).toHaveBeenCalled()
      expect(document.querySelector(".content-title").textContent).toBe(" Mes notes de frais ")
    })
  })
})

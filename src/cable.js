import { createConsumer } from "@rails/actioncable";

const consumer = createConsumer(`${process.env.REACT_APP_BACKEND_URL}/cable`)

export default consumer
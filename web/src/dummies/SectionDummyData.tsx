import { ProductSellType } from "@src/graphql/graphql";
import { SectionType } from "../components/Sections/SectionTypes";

export const dummyData: SectionType = {
  id: 3,
  image: "https://i.imgur.com/6D2TJLm.jpeg",
  title: "Nissan Silvia",
  price: 1600000000000.0,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tristique fringilla porta. Sed eu nibh nec nulla fermentum porttitor faucibus nec nulla. Integer in justo a odio lobortis aliquet. Nullam ac odio ornare, rutrum ligula vel, vulputate lacus. Maecenas id risus non nunc ultricies vestibulum. Curabitur eget mauris a ipsum semper elementum. Pellentesque tincidunt erat sit amet varius imperdiet. Vivamus nibh odio, condimentum id massa id, auctor volutpat libero. Donec sollicitudin sapien in maximus molestie. Curabitur eget interdum nulla, at rutrum turpis. Sed ornare magna a venenatis dapibus. Aenean in justo quam. Cras sit amet enim dapibus, pretium felis non, imperdiet ipsum. Praesent orci tortor, rutrum vel imperdiet nec, facilisis quis lacus. Ut urna purus, tincidunt sed purus in, pharetra tempus ipsum. Ut at condimentum velit. Donec pharetra ac urna vitae lobortis. Donec dolor nulla, accumsan sed enim quis, rutrum suscipit arcu. Aliquam nec finibus nulla.  ",
  location: "Ponte de Lima, Viana do Castelo",
  post_date: "2020-05-01",
  sellType: ProductSellType.Trade,

  titleExtraInfo: "2001",
};

export const dummyData2: SectionType = {
  id: 3,
  image: "https://i.imgur.com/5dU2qXw.jpeg",
  title: "Section title",
  price: 20.0,
  description: "Section description",
  location: "Viana do Castelo",
  post_date: "2020-05-01",
  sellType: ProductSellType.Sell,

  titleExtraInfo: "Extra info",
};

import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import FirstLogWhenCustomerIsCreatedHandler from "../../customer/event/handler/first-log-when-customer-is-created.handler";
import SecondLogWhenCustomerIsCreatedHandler from "../../customer/event/handler/second-log-when-customer-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import AddressChangedEvent from "../../customer/event/address-changed.event";
import EventDispatcher from "./event-dispatcher";
import LogWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/log-when-customer-address-is-changed.handler";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const ProductEventHandler = new SendEmailWhenProductIsCreatedHandler();
    const FirstCustomerEventHandler = new FirstLogWhenCustomerIsCreatedHandler();
    const SecondCustomerEventHandler = new SecondLogWhenCustomerIsCreatedHandler();
    const ChangeAddressEventHandler = new LogWhenCustomerAddressIsChangedHandler();
    const spyProductEventHandler = jest.spyOn(ProductEventHandler, "handle");
    const spyFirstCustomerEventHandler = jest.spyOn(FirstCustomerEventHandler, "handle");
    const spySecondCustomerEventHandler = jest.spyOn(SecondCustomerEventHandler, "handle");
    const spyChangeAddressEventHandler = jest.spyOn(ChangeAddressEventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", ProductEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", FirstCustomerEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", SecondCustomerEventHandler);
    eventDispatcher.register("AddressChangedEvent", ChangeAddressEventHandler); 

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(ProductEventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(FirstCustomerEventHandler);
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(ChangeAddressEventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 1,
        zip: "11111111",
        city: "City 1",
      },
      active: true,
      rewardPoints: 0, 
    });

    const changeAddressEvent = new AddressChangedEvent({
      id: 1,
      name: "Customer 1",
      address: {
        street: "Street 2",
        number: 222,
        zip: "2222222",
        city: "City 2",
      },
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent);
    eventDispatcher.notify(changeAddressEvent);

    expect(spyProductEventHandler).toHaveBeenCalled();
    expect(spyFirstCustomerEventHandler).toHaveBeenCalled();
    expect(spySecondCustomerEventHandler).toHaveBeenCalled();
    expect(spyChangeAddressEventHandler).toHaveBeenCalled();
  });
});

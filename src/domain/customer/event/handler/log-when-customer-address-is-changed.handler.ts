import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class LogWhenCustomerAddressIsChangedHandler
  implements EventHandlerInterface<AddressChangedEvent>
{
  handle(event: AddressChangedEvent): void {
    const id = event.eventData.id
    const name = event.eventData.name
    const street = event.eventData.address.street
    const number = event.eventData.address.number
    const city = event.eventData.address.city
    const zip = event.eventData.address.zip

    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${street}, ${number} - ${city} - ${zip}`); 
  }
}

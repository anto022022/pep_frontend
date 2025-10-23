import { BusinessAddressInfo } from "@/app/[locale]/_interface/ConnectInterface"

interface AddressProps{
    address:BusinessAddressInfo
}
export const AddressPipe:React.FC<AddressProps> = ({address}) =>{
   return(
    <span>{address.street},{address.city},{address.state}-{address.zip}</span>
   )
}
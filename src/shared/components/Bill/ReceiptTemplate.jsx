import React from 'react';
import {
    Printer,
    Text,
    Br,
    Line,
    Row,
    Cut,
    Image,
} from 'react-thermal-printer';
import {logoCafe} from "@/utils/logoCafe.js";
import {logoInstagram} from "@/utils/logoInstagram.js";
import {logoTiktok} from "@/utils/logoTiktok.js";

const ReceiptTemplate = ({bill}) => {
    return (
        <Printer type="epson" width={42} characterSet="korea" removeSpecialCharacters={false}>
            {/* Logo */}
            {/* Logo harus base64 PNG untuk thermal printer */}
            <Image src={logoCafe()} align="center"/>

            <Br/>
            <Text align="center" size={{width: 1, height: 1}}>
                Jl. Raya Banyuwangi No. 67, Gudang
            </Text>
            <Text align="center">Asembagus, Situbondo, Jawa Timur, 68373</Text>
            <Text align="center">085735717592</Text>

            <Br/>
            <Row
                left={new Date(bill.trans_date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                })}
                right={new Date(bill.trans_date).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            />
            <Text>{bill.invoice_no}</Text>
            <Row left="Customer" right={bill.customer_name}/>
            <Row
                left="Order"
                right={
                    bill.order_type === 'DI'
                        ? `Dine-in (${bill.table})`
                        : 'Take Away'
                }
            />

            <Br/>
            <Text>Pesanan:</Text>

            {bill.bill_details.map((item, idx) => (
                <React.Fragment key={idx}>
                    <Br/>
                    <Text>{item.menu.name}</Text>
                    <Row
                        left={`x${item.qty} Rp ${item.price.toLocaleString()}${
                            item.discount_price > 0 ? `(-Rp ${item.discount_price.toLocaleString()})` : ''
                        }`}
                        right={`Rp ${item.total_price.toLocaleString()}`}
                    />
                    {item.bill_detail_toppings?.length > 0 &&
                        item.bill_detail_toppings.map((top, tIdx) => (
                            <Row
                                key={tIdx}
                                left={`+ ${top.topping.name} x${top.qty}`}
                                right={`Rp ${top.price.toLocaleString()}`}
                            />
                        ))}
                </React.Fragment>
            ))}

            <Line/>
            <Row left="Total" right={`Rp ${bill.final_price.toLocaleString()}`}/>
            <Line/>

            <Br/>
            <Row>
                <Image src={logoInstagram()} width={20}/>
                <Text>Califiasfood</Text>
            </Row>
            <Row>
                <Image src={logoTiktok()} width={20}/>
                <Text>Califiasfood</Text>
            </Row>

            <Cut/>
        </Printer>
    );
};

export default ReceiptTemplate;

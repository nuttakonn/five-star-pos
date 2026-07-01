import { FlexMessage, FlexContainer, FlexBubble, FlexBox } from '@line/bot-sdk';

export class LineFlexMessageBuilder {
  static createSaleSuccess(billNumber: string, total: number, items: any[]): FlexMessage {
    const flex: FlexBubble = {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'บันทึกการขายสำเร็จ', weight: 'bold', color: '#1DB446' }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: billNumber, size: 'sm', color: '#aaaaaa' },
          { type: 'separator', margin: 'md' },
          ...items.map(item => ({
            type: 'box',
            layout: 'horizontal',
            margin: 'md',
            contents: [
              { type: 'text', text: String(item.name), flex: 4, size: 'sm' },
              { type: 'text', text: `x${item.quantity}`, flex: 1, size: 'sm', align: 'end' },
              { type: 'text', text: `฿${item.price}`, flex: 2, size: 'sm', align: 'end' }
            ]
          } as FlexBox)),
          { type: 'separator', margin: 'md' },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'md',
            contents: [
              { type: 'text', text: 'ยอดรวม', weight: 'bold' },
              { type: 'text', text: `฿${total}`, weight: 'bold', align: 'end' }
            ]
          }
        ]
      }
    };

    return {
      type: 'flex',
      altText: `Sale ${billNumber} created`,
      contents: flex
    } as FlexMessage;
  }

  static createStockList(products: any[]): FlexMessage {
    const flex: FlexBubble = {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'รายการสต็อกสินค้า', weight: 'bold', size: 'lg' }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'ชื่อสินค้า', size: 'xs', color: '#aaaaaa', flex: 4 },
              { type: 'text', text: 'คงเหลือ', size: 'xs', color: '#aaaaaa', flex: 2, align: 'end' }
            ]
          },
          { type: 'separator', margin: 'sm' },
          ...products.map(p => {
            const isLow = Number(p.stockQuantity) <= Number(p.minStockLevel);
            return {
              type: 'box',
              layout: 'horizontal',
              margin: 'md',
              contents: [
                { type: 'text', text: p.name, size: 'sm', flex: 4, wrap: true },
                { 
                  type: 'text', 
                  text: String(p.stockQuantity), 
                  size: 'sm', 
                  flex: 2, 
                  align: 'end',
                  weight: 'bold',
                  color: isLow ? '#FF0000' : '#000000'
                }
              ]
            } as FlexBox;
          })
        ]
      }
    };

    return {
      type: 'flex',
      altText: 'Stock Inventory Report',
      contents: flex
    } as FlexMessage;
  }

  static createSummary(title: string, data: any): FlexMessage {
    const flex: FlexBubble = {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: title, weight: 'bold', size: 'lg', color: '#111111' }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'ยอดขายรวม', flex: 4, size: 'sm', color: '#666666' },
              { type: 'text', text: `฿${data.totalSales.toLocaleString()}`, flex: 3, align: 'end', weight: 'bold' }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'กำไรสุทธิ', flex: 4, size: 'sm', color: '#666666' },
              { type: 'text', text: `฿${data.totalProfit.toLocaleString()}`, flex: 3, align: 'end', weight: 'bold', color: '#1DB446' }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'จำนวนบิล', flex: 4, size: 'sm', color: '#666666' },
              { type: 'text', text: `${data.totalTransactions} รายการ`, flex: 3, align: 'end', weight: 'bold' }
            ]
          }
        ]
      }
    };

    return {
      type: 'flex',
      altText: title,
      contents: flex
    } as FlexMessage;
  }

  static createDetailedDailySummary(date: string, bills: any[], products: any[]): FlexMessage {
    const totalSales = bills.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const totalProfit = bills.reduce((sum, b) => sum + Number(b.profit), 0);

    const bubbles: FlexBubble[] = [];

    // Header Bubble
    bubbles.push({
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#111111',
        contents: [
          { type: 'text', text: 'สรุปยอดขายวันนี้', weight: 'bold', color: '#ffffff', size: 'sm' },
          { type: 'text', text: date, color: '#aaaaaa', size: 'xxs' }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'ยอดรวม', size: 'sm', color: '#666666' },
              { type: 'text', text: `฿${totalSales.toLocaleString()}`, align: 'end', weight: 'bold', size: 'sm' }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'กำไร', size: 'sm', color: '#666666' },
              { type: 'text', text: `฿${totalProfit.toLocaleString()}`, align: 'end', weight: 'bold', size: 'sm', color: '#1DB446' }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'จำนวนบิล', size: 'sm', color: '#666666' },
              { type: 'text', text: `${bills.length} รายการ`, align: 'end', weight: 'bold', size: 'sm' }
            ]
          }
        ]
      }
    });

    // Bill Bubbles (Limit to 9 more bubbles to stay under Carousel limit of 10)
    const recentBills = bills.slice(0, 9);
    recentBills.forEach(bill => {
      const billItems = bill.items || [];
      bubbles.push({
        type: 'bubble',
        size: 'kilo',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: bill.billNumber, weight: 'bold', size: 'xs' },
            { type: 'text', text: bill.customerName, size: 'xxs', color: '#aaaaaa' }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            ...billItems.map((item: any) => ({
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: `${item.name || item.productId} x${item.quantity}`, size: 'xxs', flex: 4 },
                { type: 'text', text: `฿${Number(item.subTotal).toLocaleString()}`, size: 'xxs', flex: 2, align: 'end' }
              ]
            } as FlexBox)),
            { type: 'separator', margin: 'sm' },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: 'รวม', weight: 'bold', size: 'xs' },
                { type: 'text', text: `฿${Number(bill.totalAmount).toLocaleString()}`, align: 'end', weight: 'bold', size: 'xs' }
              ]
            }
          ]
        }
      });
    });

    return {
      type: 'flex',
      altText: `สรุปยอดขาย ${date}`,
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    } as FlexMessage;
  }

  static createDetailedMonthlySummary(month: string, dailyStats: any[]): FlexMessage {
    const totalSales = dailyStats.reduce((sum, s) => sum + s.totalSales, 0);
    const totalTransactions = dailyStats.reduce((sum, s) => sum + s.totalTransactions, 0);

    const bubbles: FlexBubble[] = [];

    // Summary Bubble
    bubbles.push({
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#0047AB',
        contents: [
          { type: 'text', text: `สรุปเดือน ${month}`, weight: 'bold', color: '#ffffff', size: 'sm' }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'ยอดขายทั้งเดือน', size: 'sm', color: '#666666', flex: 4 },
              { type: 'text', text: `฿${totalSales.toLocaleString()}`, align: 'end', weight: 'bold', size: 'sm', flex: 3 }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: 'รวมบิลทั้งสิ้น', size: 'sm', color: '#666666', flex: 4 },
              { type: 'text', text: `${totalTransactions} บิล`, align: 'end', weight: 'bold', size: 'sm', flex: 3 }
            ]
          }
        ]
      }
    });

    // Daily Bubbles (Split into groups of 5 days per bubble to optimize space)
    for (let i = 0; i < dailyStats.length; i += 5) {
        const chunk = dailyStats.slice(i, i + 5);
        bubbles.push({
            type: 'bubble',
            size: 'kilo',
            header: {
                type: 'box',
                layout: 'vertical',
                contents: [{ type: 'text', text: 'รายละเอียดรายวัน', weight: 'bold', size: 'xs' }]
            },
            body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                contents: chunk.map(day => ({
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                { type: 'text', text: day.date.slice(8), weight: 'bold', size: 'sm', flex: 1 },
                                { type: 'text', text: `฿${day.totalSales.toLocaleString()}`, align: 'end', size: 'sm', flex: 3, weight: 'bold' }
                            ]
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                { type: 'text', text: `${day.totalTransactions} บิล | ${day.topItems.join(', ')}`, size: 'xxs', color: '#aaaaaa', flex: 1 }
                            ]
                        }
                    ]
                } as FlexBox))
            }
        });
    }

    return {
      type: 'flex',
      altText: `สรุปเดือน ${month}`,
      contents: {
        type: 'carousel',
        contents: bubbles.slice(0, 10) // Carousel limit
      }
    } as FlexMessage;
  }

  static createSimpleText(text: string): any {
    return { type: 'text', text };
  }
}


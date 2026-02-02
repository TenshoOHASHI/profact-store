import { IOrderRepository } from "@/domain/repositories/IOrderRepository";
import { Order } from "@/domain/entities/Order";
import { OrderItem } from "@/domain/entities/OrderItems";
import { OrderStatus } from "@/domain/valueObjects/OrderStatus";
import { Money } from "@/domain/valueObjects/Money";
import { Email } from "@/domain/valueObjects/Email";
import { Quantity } from "@/domain/valueObjects/Quantity";
import { prisma } from "../prisma/prismaClient";
import { Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export class PrsimaOrderRepository implements IOrderRepository {
  async save(order: Order): Promise<void> {
    // Mapper
    const prismaData = this.toPrismaData(order);

    // update + insert
    await prisma.order.upsert({
      where: { id: order.id },
      update: {
        status: prismaData.status,
        stripePaymentIntentId: prismaData.stripePaymentIntentId,
        items: {
          // delete all data
          deleteMany: {},
          // create new data
          create: prismaData.items?.create,
        },
      },
      create: prismaData,
    });
  }

  async findById(id: string): Promise<Order | null> {
    const record = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!record) return null;
    return this.toDomainEntity(record);
  }

  async findByGuestSessionId(sessionId: string): Promise<Order[]> {
    const records = await prisma.order.findMany({
      where: { guestSessionId: sessionId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => this.toDomainEntity(record));
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<Order | null> {
    const record = await prisma.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
      include: { items: true },
    });
    if (!record) return null;
    return this.toDomainEntity(record);
  }

  // DTO
  private toDomainEntity(record: OrderWithItems): Order {
    const items = record.items.map((item) => {
      return new OrderItem({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        unitPrice: new Money(item.unitPrice),
        quantity: new Quantity(item.quantity),
        taxRate: item.taxRate,
      });
    });

    return new Order({
      id: record.id,
      customerEmail: new Email(record.customerEmail),
      customerName: record.customerName,
      items,
      status: record.status as OrderStatus,
      stripePaymentIntentId: record.stripePaymentIntentId || undefined,
      guestSessionId: record.guestSessionId ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  // Mapper
  private toPrismaData(order: Order): Prisma.OrderCreateInput {
    return {
      id: order.id,
      customerEmail: order.customerEmail.value,
      customerName: order.customerName,
      status: order.status,
      stripePaymentIntentId: order.stripePaymentIntentId ?? null,
      // define relation id
      guestSession: order.guestSessionId
        ? { connect: { id: order.guestSessionId } }
        : undefined,
      createdAt: order.createdAt,
      items: {
        // Prisma: Use 'create' to generate nested OrderItem records
        create: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice.value,
          quantity: item.quantity.value,
        })),
      },
    };
  }
}

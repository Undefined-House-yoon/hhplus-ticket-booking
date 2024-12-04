-- CreateTable
CREATE TABLE "TicketSession" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_due_at" TIMESTAMP(3) NOT NULL,
    "ticket_viewed_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "TicketSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketSession_user_id_key" ON "TicketSession"("user_id");

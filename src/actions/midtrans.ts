/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";
import snapClient, { invoiceClient } from "@/lib/midtrans-client";
import { ActionResponses, ActionResponse } from "@/lib/actions";
import {
  CancelTransactionResponse,
  CreateInvoiceSuccessResponse,
  CreateTransactionResponse,
  CreateTransactionSuccessResponse,
  InvoiceRequestBody,
  RequestBody,
  TransactionStatusResponse,
} from "@/types/midtrans";

/**
 * Create a transaction using Snap API
 * @param parameter - Parameters required to create a transaction
 * @returns ActionResponse with transaction data or error
 */
export async function createTransaction(
  parameter: RequestBody,
): Promise<ActionResponse<CreateTransactionResponse>> {
  try {
    const transaction: CreateTransactionSuccessResponse =
      await snapClient.createTransaction(parameter);
    return ActionResponses.success(transaction);
  } catch (error: any) {
    return ActionResponses.serverError(
      error?.response?.data?.error_messages?.join(", ") ||
        error?.message ||
        "Unknown error occurred",
    );
  }
}

/**
 * Create a transaction using Invoice API
 * @param parameter - Parameters required to create a transaction
 * @returns ActionResponse with transaction data or error
 */
export async function createTransactionInvoice(
  parameter: InvoiceRequestBody,
): Promise<ActionResponse<CreateInvoiceSuccessResponse>> {
  try {
    const transaction = await invoiceClient.createInvoice(parameter);
    return ActionResponses.success(transaction);
  } catch (error: any) {
    return ActionResponses.serverError(
      error?.response?.data?.error_messages?.join(", ") ||
        error?.message ||
        "Unknown error occurred",
    );
  }
}

/**
 * Check the status of a transaction
 * @param transactionId - The ID of the transaction to check
 * @returns ActionResponse with transaction status or error
 */
export async function checkTransactionStatus(
  transactionId: string,
): Promise<ActionResponse<TransactionStatusResponse>> {
  try {
    const status = await snapClient.transaction.status(transactionId);
    return ActionResponses.success(status);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return ActionResponses.notFound("Transaction not found");
    }
    return ActionResponses.serverError(
      error?.message || "Failed to fetch transaction status",
    );
  }
}

/**
 * Cancel a transaction
 * @param transactionId - The ID of the transaction to cancel
 * @returns ActionResponse indicating success or error
 */
export async function cancelTransaction(
  transactionId: string,
): Promise<ActionResponse<CancelTransactionResponse>> {
  try {
    const cancelResponse = await snapClient.transaction.cancel(transactionId);
    return ActionResponses.success(cancelResponse);
  } catch (error: any) {
    return ActionResponses.serverError(
      error?.message || "Failed to cancel transaction",
    );
  }
}

/**
 * Expire a transaction
 * @param transactionId - The ID of the transaction to expire
 * @returns ActionResponse indicating success or error
 */
export async function expireTransaction(
  transactionId: string,
): Promise<ActionResponse> {
  try {
    const expireResponse = await snapClient.transaction.expire(transactionId);
    return ActionResponses.success(expireResponse);
  } catch (error: any) {
    return ActionResponses.serverError(
      error?.message || "Failed to expire transaction",
    );
  }
}

/**
 * Refund a transaction
 * @param transactionId - The ID of the transaction to refund
 * @param parameter - Parameters required for the refund
 * @returns ActionResponse indicating success or error
 */
export async function refundTransaction(
  transactionId: string,
  parameter: Record<string, any>,
): Promise<ActionResponse> {
  try {
    const refundResponse = await snapClient.transaction.refund(
      transactionId,
      parameter,
    );
    return ActionResponses.success(refundResponse);
  } catch (error: any) {
    return ActionResponses.serverError(
      error?.message || "Failed to refund transaction",
    );
  }
}

/**
 * Directly refund a transaction
 * @param transactionId - The ID of the transaction to refund directly
 * @param parameter - Parameters required for the direct refund
 * @returns ActionResponse indicating success or error
 */
export async function directRefundTransaction(
  transactionId: string,
  parameter: Record<string, any>,
): Promise<ActionResponse> {
  try {
    const refundDirectResponse = await snapClient.transaction.refundDirect(
      transactionId,
      parameter,
    );
    return ActionResponses.success(refundDirectResponse);
  } catch (error: any) {
    return ActionResponses.serverError(
      error?.message || "Failed to perform direct refund",
    );
  }
}

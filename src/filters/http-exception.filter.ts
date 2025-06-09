// create a global exception filter so that we don't have to wrap the methods in every service inside try and catch just to handle the exception error
import {
  ExceptionFilter,      // Interface to implement a custom exception filter
  Catch,                // Decorator to define which exceptions the filter should catch
  ArgumentsHost,        // Provides access to request/response objects
  HttpException,        // Base class for all HTTP exceptions
  HttpStatus,           // Enum for standard HTTP status codes
  Logger,               // Logger utility for logging errors
} from '@nestjs/common';

import { Request, Response } from 'express'; // To strongly type the request and response


@Catch() // Decorator to catch all exceptions (if left empty, it catches everything)
export class AllExceptionsFilter implements ExceptionFilter { // Custom filter class that implements the ExceptionFilter interface
  private readonly logger = new Logger(AllExceptionsFilter.name); // Create a logger instance with the class name as context

  catch(exception: unknown, host: ArgumentsHost) { // This method is called automatically when an exception occurs
    const ctx = host.switchToHttp(); // Get the HTTP-specific context (used for REST APIs, not GraphQL or WebSockets)
    const response = ctx.getResponse<Response>(); // Get the Express response object to send a custom error response
    const request = ctx.getRequest<Request>(); // Get the Express request object to access method, URL, etc.

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default status code to 500 (Internal Server Error)
    let message = 'Unexpected error occurred'; // Default error message

    if (exception instanceof HttpException) { // If the exception is an HTTP exception (e.g., BadRequest, Unauthorized)
      status = exception.getStatus(); // Get the HTTP status code from the exception
      const res = exception.getResponse(); // Get the response object or message
      message = typeof res === 'string' ? res : (res as any).message; // Extract the message (whether string or object)
    }

    this.logger.error( // Log the error in a readable format
      `[${request.method}] ${request.url} - ${status} Error: ${message}`, // Example: [POST] /auth - 401 Error: Unauthorized
    );


    response.status(status).json({ // Send a JSON response to the client with the error details
      statusCode: status, // The HTTP status code (e.g., 400, 401, 500)
      message, // The error message
      timestamp: new Date().toISOString(), // Timestamp of when the error occurred
      path: request.url, // The URL path that caused the error
    });
  }
}

// See the full documentation of Exception filter under the Overview in NestJs


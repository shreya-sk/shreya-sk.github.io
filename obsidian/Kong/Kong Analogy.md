Bird's view for [[Kong API Gateway - Overview|Kong]]
# Kong Gateway - The Airport Analogy

Kong Gateway can be understood as an international airport managing the flow of travelers (API requests) to various destinations:

## The Airport System

**Kong Gateway** is the entire airport complex, designed to efficiently manage traffic between travelers (clients) and destinations (services).

**Control Plane** is the airport's command center with its management offices. It houses all the rules, flight paths, and security protocols that govern how the airport operates. Airport administrators make changes here that affect the entire system.

**Data Plane** represents the actual terminals, runways, and gates where passengers and luggage (API traffic) are physically processed. It implements the rules set by the command center.

## Operations

**Kong Admin API** is like the airport's internal communication system that staff use to coordinate operations without going through the public-facing systems.

**Kong Manager** is the visual monitoring system in the command center where administrators can see all airport operations at a glance and make adjustments through a dashboard.

**decK** is the airport's configuration management system, like a versioned set of airport procedure manuals that can be updated, rolled back, and distributed across all terminals.

## Travelers and Destinations

**Services** are the destination cities. Each city (external API or microservice) is where travelers ultimately want to go.

**Routes** are the specific flight paths to those cities. Multiple routes (combinations of paths, methods, headers) can lead to the same destination city (Service). Some routes are direct, others might have specific requirements or go through particular airways.

**Consumers** are like registered frequent flyers with their own profiles. They have membership cards (API keys) that give them access to certain lounges (API endpoints) and privileges (rate limits).

**Plugins** are special services available throughout the airport - security screenings, baggage handling, customs checks, VIP lounges. These can be applied airport-wide, to specific terminals only (Services), to certain flight paths (Routes), or exclusively for certain frequent flyers (Consumers).

When a traveler (API request) arrives at the airport, Kong checks their tickets (endpoints/headers), directs them through the appropriate security measures (authentication plugins), routes them to the correct gate (Service), and ensures they reach their destination efficiently while following all the rules set by the command center.
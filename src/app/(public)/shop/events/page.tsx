'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Button, Badge, Card, CardContent } from '@/components/atoms';
import { Gate } from '@/features/auth/components/Gate';
import { EVENTS } from '@/features/shop/data/products';

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function EventsPage() {
    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Event Tickets</h1>
                    <p className="text-neutral-400">
                        Join nuvaClub in-person and online events, connect with community members
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EVENTS.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card hover className="h-full overflow-hidden flex flex-col">
                                <div className="relative aspect-[2/1]">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="primary">
                                            {event.remainingSeats} seats left
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {event.name}
                                    </h3>
                                    <p className="text-sm text-neutral-400 mb-4 flex-grow">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-neutral-400 mb-4">
                                        <span>{formatDate(event.date)}</span>
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xl font-bold text-white">
                                            ${event.price.toLocaleString()}
                                        </span>
                                        <Gate
                                            permission="shop:purchase"
                                            fallback={
                                                <Button size="sm" variant="secondary" disabled>
                                                    Log in to purchase
                                                </Button>
                                            }
                                        >
                                            <Button size="sm">Buy Ticket</Button>
                                        </Gate>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('booking.user', 'booking.jadwalTrip.paket')->get();
        return response()->json($payments);
    }

    public function show($id)
    {
        $payment = Payment::with('booking.user', 'booking.jadwalTrip.paket')->findOrFail($id);
        return response()->json($payment);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id'       => 'required|exists:bookings,id',
            'jumlah_bayar'     => 'required|numeric|min:0',
            'bukti_pembayaran' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        $payment = Payment::create([
            'booking_id'       => $validated['booking_id'],
            'jumlah_bayar'     => $validated['jumlah_bayar'],
            'bukti_pembayaran' => $validated['bukti_pembayaran'] ?? null,
            'status_verifikasi'=> 'pending',
        ]);

        if ($validated['jumlah_bayar'] >= $booking->total_harga) {
            $booking->status_pembayaran = 'paid';
            $booking->save();
        }

        return response()->json($payment->load('booking'), 201);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'status_verifikasi' => 'sometimes|required|in:pending,verified,rejected',
        ]);

        $payment->update($validated);

        return response()->json($payment->load('booking'));
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment dihapus']);
    }
}
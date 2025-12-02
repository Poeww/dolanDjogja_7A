<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with('booking.jadwalTrip.paket', 'booking.user')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id'       => 'required|integer|exists:bookings,id',
            'jumlah_bayar'     => 'required|numeric|min:0',
            'bukti_pembayaran' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tidak boleh membayar booking orang lain'], 403);
        }

        $payment = Payment::create([
            'booking_id'       => $validated['booking_id'],
            'jumlah_bayar'     => $validated['jumlah_bayar'],
            'bukti_pembayaran' => $validated['bukti_pembayaran'] ?? null,
            'status_verifikasi'=> 'pending',
        ]);

        return response()->json(
            $payment->load('booking.jadwalTrip.paket'),
            201
        );
    }

    public function show($id)
    {
        return response()->json(
            Payment::with('booking.jadwalTrip.paket', 'booking.user')->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'status_verifikasi' => 'required|in:pending,verified,rejected',
        ]);

        $payment->update($validated);

        return response()->json(
            $payment->load('booking.jadwalTrip.paket')
        );
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment dihapus']);
    }
}
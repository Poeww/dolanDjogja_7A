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
            'metode_pembayaran'=> 'required|string',
            'kode_pembayaran'  => 'required|string',
            'bukti_pembayaran' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tidak boleh membayar booking orang lain'], 403);
        }

        if ($request->hasFile('bukti_pembayaran')) {
            $file = $request->file('bukti_pembayaran');
            $filename = time() . '_' . str_replace(' ', '-', $file->getClientOriginalName());

            $destination = public_path('uploads/payments');
            if (!file_exists($destination)) mkdir($destination, 0777, true);

            $file->move($destination, $filename);

            $validated['bukti_pembayaran'] = 'uploads/payments/' . $filename;
        }

        $validated['status_verifikasi'] = 'pending';

        $payment = Payment::create($validated);

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

        if ($payment->bukti_pembayaran && file_exists(public_path($payment->bukti_pembayaran))) {
            unlink(public_path($payment->bukti_pembayaran));
        }

        $payment->delete();

        return response()->json(['message' => 'Payment dihapus']);
    }
}

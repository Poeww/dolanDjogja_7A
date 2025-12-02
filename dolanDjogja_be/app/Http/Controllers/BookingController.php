<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\JadwalTrip;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(
            Booking::with('user', 'jadwalTrip.paket')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jadwal_trip_id' => 'required|integer|exists:jadwal_trip,id',
            'jumlah_orang' => 'required|integer|min:1',
        ]);

        $jadwal = JadwalTrip::findOrFail($validated['jadwal_trip_id']);

        $total = $jadwal->harga_per_orang * $validated['jumlah_orang'];

        $booking = Booking::create([
            'user_id'           => $request->user()->id,
            'jadwal_trip_id'    => $validated['jadwal_trip_id'],
            'jumlah_orang'      => $validated['jumlah_orang'],
            'total_harga'       => $total,
            'status_pembayaran' => 'pending'
        ]);

        return response()->json(
            $booking->load('jadwalTrip.paket'),
            201
        );
    }

    public function show($id)
    {
        return response()->json(
            Booking::with('user', 'jadwalTrip.paket', 'payment')->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'status_pembayaran' => 'required|in:pending,paid,cancelled',
        ]);

        $booking->update($validated);

        return response()->json(
            $booking->load('jadwalTrip.paket')
        );
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->payment) {
            $booking->payment->delete();
        }

        $booking->delete();

        return response()->json(['message' => 'Booking dihapus']);
    }
}
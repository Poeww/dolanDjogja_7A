<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\JadwalTrip;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'jadwalTrip.paket'])->get();
        return response()->json($bookings);
    }

    public function show($id)
    {
        $booking = Booking::with(['user', 'jadwalTrip.paket'])->findOrFail($id);
        return response()->json($booking);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jadwal_trip_id' => 'required|exists:jadwal_trip,id',
            'jumlah_orang'   => 'required|integer|min:1',
            'metode_pembayaran' => 'nullable|string|max:100',
        ]);

        $jadwal = JadwalTrip::findOrFail($validated['jadwal_trip_id']);

        if ($jadwal->kuota_tersedia < $validated['jumlah_orang']) {
            return response()->json([
                'message' => 'Kuota tidak mencukupi'
            ], 422);
        }

        $total = $jadwal->harga_per_orang * $validated['jumlah_orang'];

        $booking = Booking::create([
            'user_id'          => auth()->id() ?? $request->user_id, // sementara, nanti pakai auth
            'jadwal_trip_id'   => $validated['jadwal_trip_id'],
            'jumlah_orang'     => $validated['jumlah_orang'],
            'total_harga'      => $total,
            'metode_pembayaran'=> $validated['metode_pembayaran'] ?? null,
            'status_pembayaran'=> 'pending',
        ]);

        $jadwal->kuota_tersedia -= $validated['jumlah_orang'];
        $jadwal->save();

        return response()->json($booking->load('jadwalTrip.paket', 'user'), 201);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'status_pembayaran' => 'sometimes|required|in:pending,paid,cancelled',
            'metode_pembayaran' => 'sometimes|nullable|string|max:100',
        ]);

        $booking->update($validated);

        return response()->json($booking->load('jadwalTrip.paket', 'user'));
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);

        $booking->delete();

        return response()->json(['message' => 'Booking dihapus']);
    }
}
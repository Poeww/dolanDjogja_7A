<?php

namespace App\Http\Controllers;

use App\Models\JadwalTrip;
use App\Models\PaketWisata;
use Illuminate\Http\Request;

class JadwalTripController extends Controller
{
    public function index()
    {
        $jadwal = JadwalTrip::with('paket')->get();
        return response()->json($jadwal);
    }

    public function show($id)
    {
        $jadwal = JadwalTrip::with('paket')->findOrFail($id);
        return response()->json($jadwal);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paket_id'          => 'required|exists:paket_wisata,id',
            'tanggal_berangkat' => 'required|date',
            'tanggal_pulang'    => 'required|date|after_or_equal:tanggal_berangkat',
            'kuota_tersedia'    => 'required|integer|min:0',
            'harga_per_orang'   => 'required|numeric|min:0',
        ]);

        $jadwal = JadwalTrip::create($validated);

        return response()->json($jadwal->load('paket'), 201);
    }

    public function update(Request $request, $id)
    {
        $jadwal = JadwalTrip::findOrFail($id);

        $validated = $request->validate([
            'paket_id'          => 'sometimes|required|exists:paket_wisata,id',
            'tanggal_berangkat' => 'sometimes|required|date',
            'tanggal_pulang'    => 'sometimes|required|date|after_or_equal:tanggal_berangkat',
            'kuota_tersedia'    => 'sometimes|required|integer|min:0',
            'harga_per_orang'   => 'sometimes|required|numeric|min:0',
        ]);

        $jadwal->update($validated);

        return response()->json($jadwal->load('paket'));
    }

    public function destroy($id)
    {
        $jadwal = JadwalTrip::findOrFail($id);
        $jadwal->delete();

        return response()->json(['message' => 'Jadwal trip dihapus']);
    }
}
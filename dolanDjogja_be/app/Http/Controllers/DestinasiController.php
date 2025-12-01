<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use Illuminate\Http\Request;

class DestinasiController extends Controller
{
    public function index()
    {
        $destinasi = Destinasi::all();
        return response()->json($destinasi);
    }

    public function show($id)
    {
        $destinasi = Destinasi::findOrFail($id);
        return response()->json($destinasi);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_destinasi' => 'required|string|max:200',
            'lokasi'         => 'nullable|string|max:200',
            'deskripsi'      => 'nullable|string',
            'harga_tiket'    => 'nullable|numeric|min:0',
            'jam_buka'       => 'nullable|string|max:100',
            'gambar'         => 'nullable|string',
        ]);

        $destinasi = Destinasi::create($validated);

        return response()->json($destinasi, 201);
    }

    public function update(Request $request, $id)
    {
        $destinasi = Destinasi::findOrFail($id);

        $validated = $request->validate([
            'nama_destinasi' => 'sometimes|required|string|max:200',
            'lokasi'         => 'sometimes|nullable|string|max:200',
            'deskripsi'      => 'sometimes|nullable|string',
            'harga_tiket'    => 'sometimes|nullable|numeric|min:0',
            'jam_buka'       => 'sometimes|nullable|string|max:100',
            'gambar'         => 'sometimes|nullable|string',
        ]);

        $destinasi->update($validated);

        return response()->json($destinasi);
    }

    public function destroy($id)
    {
        $destinasi = Destinasi::findOrFail($id);
        $destinasi->delete();

        return response()->json(['message' => 'Destinasi dihapus']);
    }
}
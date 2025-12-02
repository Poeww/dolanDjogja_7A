<?php

namespace App\Http\Controllers;

use App\Models\PaketWisata;
use Illuminate\Http\Request;

class PaketWisataController extends Controller
{
    public function index()
    {
        return response()->json(
            PaketWisata::with('destinasi', 'jadwal')->get()
        );
    }

    public function show($id)
    {
        return response()->json(
            PaketWisata::with('destinasi', 'jadwal')->findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_paket'      => 'required|string|max:200',
            'deskripsi'       => 'nullable|string',
            'harga'           => 'required|numeric|min:0',
            'durasi'          => 'required|string|max:50',
            'lokasi_tujuan'   => 'required|string|max:200',
            'kuota'           => 'required|integer|min:0',
            'gambar_thumbnail'=> 'nullable|string',

            'destinasi_ids'   => 'array',
            'destinasi_ids.*' => 'integer|exists:destinasi,id',
        ]);

        $paket = PaketWisata::create(
            collect($validated)->except('destinasi_ids')->toArray()
        );

        if ($request->has('destinasi_ids')) {
            $paket->destinasi()->sync($validated['destinasi_ids']);
        }

        return response()->json(
            $paket->load('destinasi', 'jadwal'), 
            201
        );
    }

    public function update(Request $request, $id)
    {
        $paket = PaketWisata::findOrFail($id);

        $validated = $request->validate([
            'nama_paket'      => 'sometimes|required|string|max:200',
            'deskripsi'       => 'sometimes|nullable|string',
            'harga'           => 'sometimes|required|numeric|min:0',
            'durasi'          => 'sometimes|required|string|max:50',
            'lokasi_tujuan'   => 'sometimes|required|string|max:200',
            'kuota'           => 'sometimes|required|integer|min:0',
            'gambar_thumbnail'=> 'sometimes|nullable|string',

            'destinasi_ids'   => 'sometimes|array',
            'destinasi_ids.*' => 'integer|exists:destinasi,id',
        ]);

        $paket->update(
            collect($validated)->except('destinasi_ids')->toArray()
        );

        if ($request->has('destinasi_ids')) {
            $paket->destinasi()->sync($validated['destinasi_ids']);
        }

        return response()->json(
            $paket->load('destinasi', 'jadwal')
        );
    }

    public function destroy($id)
    {
        $paket = PaketWisata::findOrFail($id);
        $paket->destinasi()->detach();
        $paket->delete();
        return response()->json(['message' => 'Paket wisata dihapus!']);
    }
}
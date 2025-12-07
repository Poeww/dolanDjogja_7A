<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use Illuminate\Http\Request;

class DestinasiController extends Controller
{
    public function index()
    {
        return response()->json(Destinasi::all());
    }

    public function show($id)
    {
        return response()->json(
            Destinasi::findOrFail($id)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_destinasi' => 'required|string|max:255',
            'lokasi'         => 'required|string|max:255',
            'deskripsi'      => 'nullable|string',
            'harga_tiket'    => 'required|numeric|min:0',
            'jam_buka'       => 'nullable|string|max:255',
            'gambar'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('gambar')) {

            $file = $request->file('gambar');

            $filename = str_replace(' ', '-', $file->getClientOriginalName());

            $destination = public_path('destinasi');
            if (!file_exists($destination)) {
                mkdir($destination, 0777, true);
            }

            $file->move($destination, $filename);

            $validated['gambar'] = 'destinasi/' . $filename;
        }

        $destinasi = Destinasi::create($validated);

        return response()->json($destinasi, 201);
    }

    public function update(Request $request, $id)
    {
        $destinasi = Destinasi::findOrFail($id);

        $validated = $request->validate([
            'nama_destinasi' => 'sometimes|required|string|max:255',
            'lokasi'         => 'sometimes|required|string|max:255',
            'deskripsi'      => 'sometimes|nullable|string',
            'harga_tiket'    => 'sometimes|required|numeric|min:0',
            'jam_buka'       => 'sometimes|nullable|string|max:255',
            'gambar'         => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('gambar')) {

            if ($destinasi->gambar && file_exists(public_path($destinasi->gambar))) {
                unlink(public_path($destinasi->gambar));
            }

            $file = $request->file('gambar');
            $filename = str_replace(' ', '-', $file->getClientOriginalName());

            $destination = public_path('destinasi');
            if (!file_exists($destination)) {
                mkdir($destination, 0777, true);
            }

            $file->move($destination, $filename);

            $validated['gambar'] = 'destinasi/' . $filename;
        }

        $destinasi->update($validated);

        return response()->json($destinasi);
    }

    public function destroy($id)
    {
        $destinasi = Destinasi::findOrFail($id);

        $destinasi->paketWisata()->detach();

        $destinasi->delete();

        return response()->json(['message' => 'Destinasi dihapus']);
    }
}
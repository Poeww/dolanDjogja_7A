<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destinasi extends Model
{
    use HasFactory;

    protected $table = 'destinasi';

    protected $fillable = [
        'nama_destinasi',
        'lokasi',
        'deskripsi',
        'harga_tiket',
        'jam_buka',
        'gambar'
    ];

    public function paketWisata()
    {
        return $this->belongsToMany(PaketWisata::class, 'paket_destinasi', 'destinasi_id', 'paket_id');
    }
}
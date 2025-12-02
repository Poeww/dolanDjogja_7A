<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaketWisata extends Model
{
    use HasFactory;

    protected $table = 'paket_wisata';

    protected $fillable = [
        'nama_paket',
        'deskripsi',
        'harga',
        'durasi',
        'lokasi_tujuan',
        'kuota',
        'gambar_thumbnail',
    ];

    public function destinasi()
    {
        return $this->belongsToMany(Destinasi::class, 'paket_destinasi', 'paket_id', 'destinasi_id');
    }

    public function jadwal()
    {
        return $this->hasMany(JadwalTrip::class, 'paket_id');
    }
}
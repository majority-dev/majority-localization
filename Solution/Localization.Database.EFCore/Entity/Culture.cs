﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Localization.Database.Abstractions.Entity;

namespace Localization.Database.EFCore.Entity
{
    public sealed class Culture : ICulture
    {
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(5)")]
        public string Name { get; set; }

    
        public ICollection<BaseText> BaseTexts { get; set; }

        //public ICollection<CultureHierarchy> CultureHierarchies { get; set; }
       // public ICollection<CultureHierarchy> CultureParentHierarchies { get; set; }
       // public ICollection<BaseText> CultureTexts { get; set; }

        public Culture()
        {
            //CultureHierarchies = new List<CultureHierarchy>();
            //CultureParentHierarchies = new List<CultureHierarchy>();
           // CultureTexts = new List<BaseText>();
        }
    }
}